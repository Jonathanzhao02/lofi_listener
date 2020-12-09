import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { VoiceBroadcast, Snowflake } from 'discord.js';
import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import SongChangeListener from './SongChangeListener';
import Server from './Server';
import ServerSchema from './models/ServerSchema';
import ServerMongooseProvider from './providers/ServerMongooseProvider';

const { DB_URL, STATS_SAVE_INTERVAL, BOT_PREFIX, MAX_LAST_SONGS } = require('../config.json');

export default class LofiClient extends AkairoClient {
    private commandHandler: CommandHandler;
    private inhibitorHandler: InhibitorHandler;
    private listenerHandler: ListenerHandler;
    private broadcast: VoiceBroadcast;
    private servers: Map<Snowflake, Server>;
    private startTime: number;
    private totalTime: number;
    private songListener: SongChangeListener;
    private songsPlayed: number;
    private totalSongsPlayed: number;
    private lastSongs: string[];
    readonly provider: ServerMongooseProvider;

    constructor() {
        super(
            {
                ownerID: '290237225596092416'
            },
            {
                messageCacheMaxSize: 0,
                messageEditHistoryMaxSize: 0
            }
        );

        this.commandHandler = new CommandHandler(this, {
            directory: './build/commands/',
            prefix: async (message): Promise<string> => {
                if (!message.guild) return BOT_PREFIX;

                if (!this.hasServer(message.guild.id)) {
                    const server = new Server(this);
                    await server.init(message);                    
                    this.addServer(message.guild.id, server);
                }

                return this.getServer(message.guild.id).getPrefix();
            }
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './build/inhibitors/'
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './build/listeners'
        });

        this.broadcast = this.voice.createBroadcast();
        this.servers = new Map<Snowflake, Server>();
        this.startTime = Date.now();
        this.songsPlayed = 0;

        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.registerEmitter('commandHandler', this.commandHandler);
        this.registerEmitter('inhibitorHandler', this.inhibitorHandler);
        this.registerEmitter('listenerHandler', this.listenerHandler);

        this.provider = new ServerMongooseProvider(ServerSchema);
    }

    async saveStats(): Promise<void> {
        await this.provider.set('me', 'data.totalTime', Date.now() - this.startTime + this.totalTime);
        await this.provider.set('me', 'data.totalSongs', this.songsPlayed + this.totalSongsPlayed);

        for (const [id, server] of this.servers) {
            await this.provider.set(id, 'data.totalTime', server.totalEtime());
            await this.provider.set(id, 'data.totalSongs', server.getTotalSongsPlayed());
        }
    }

    async login(token: string): Promise<string> {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        await this.provider.init();
        this.lastSongs = [];
        this.totalTime = this.provider.get('me', 'data.totalTime', 0);
        this.totalSongsPlayed = this.provider.get('me', 'data.totalSongs', 0);
        Server.setProvider(this.provider);
        this.setInterval(this.saveStats.bind(this), STATS_SAVE_INTERVAL);
        return super.login(token);
    }

    load(): void {
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();
        this.commandHandler.loadAll();
    }

    registerEmitter(id: string, emitter: EventEmitter): void {
        this.listenerHandler.emitters.set(id, emitter);
    }

    broadcastSound(url: string): void {
        this.broadcast.play(url);
    }

    foreachServer(handler: (Server) => void): void {
        this.servers.forEach(server => handler(server));
    }

    getServer(id: Snowflake): Server {
        return this.servers.get(id);
    }

    addServer(id: Snowflake, server: Server): Map<Snowflake, Server> {
        return this.servers.set(id, server);
    }

    hasServer(id: Snowflake): boolean {
        return this.servers.has(id);
    }

    removeServer(id: Snowflake): boolean {
        return this.servers.delete(id);
    }

    setSongListener(listener: SongChangeListener): void {
        this.songListener = listener;
    }

    getSongListener(): SongChangeListener {
        return this.songListener;
    }

    getSongsPlayed(): number {
        return this.songsPlayed;
    }

    getTotalSongsPlayed(): number {
        return this.totalSongsPlayed + this.songsPlayed;
    }

    etime(): number {
        return Date.now() - this.startTime;
    }

    totalEtime(): number {
        return Date.now() - this.startTime + this.totalTime;
    }

    getStartDate(): Date {
        return new Date(this.startTime);
    }

    getBroadcast(): VoiceBroadcast {
        return this.broadcast;
    }

    pushLastSong(): void {
        this.lastSongs.unshift(this.songListener.getLastSong());
        this.songsPlayed++;

        while (this.lastSongs.length > MAX_LAST_SONGS) {
            this.lastSongs.pop();
        }
    }

    getLastSongs(): string {
        return this.lastSongs.reduce((prev, current, index) => index + '. ' + prev + current + '\n', '');
    }

    getCommandHandler(): CommandHandler {
        return this.commandHandler;
    }
}
