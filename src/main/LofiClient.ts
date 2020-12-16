import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { VoiceBroadcast, Snowflake } from 'discord.js';
import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import MemSongListener from './MemSongListener';
import Server from './Server';
import ServerSchema, { ServerDocument } from './models/ServerSchema';
import ServerMongooseProvider from './providers/ServerMongooseProvider';

const DB_URL = process.env['DB_URL'];
const BOT_PREFIX = process.env['BOT_PREFIX'];
const STATS_SAVE_INTERVAL = Number(process.env['STATS_SAVE_INTERVAL']);
const LEADERBOARD_UPDATE_INTERVAL = Number(process.env['LEADERBOARD_UPDATE_INTERVAL']);
const MAX_LEADERBOARD_POSITIONS = Number(process.env['MAX_LEADERBOARD_POSITIONS']);
const MAX_LAST_SONGS = Number(process.env['MAX_LAST_SONGS']);

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class LofiClient extends AkairoClient {
    private static singleton: LofiClient;
    private commandHandler: CommandHandler;
    private inhibitorHandler: InhibitorHandler;
    private listenerHandler: ListenerHandler;
    private broadcast: VoiceBroadcast;
    private servers: Map<Snowflake, Server>;
    private startTime: number;
    private totalTime: number;
    private songListener: MemSongListener;
    private songsPlayed: number;
    private totalSongsPlayed: number;
    private lastSongs: string[];
    private timeLeaderboard: ServerDocument[];
    private songLeaderboard: ServerDocument[];
    readonly provider: ServerMongooseProvider;

    static getSingleton(): LofiClient {
        return this.singleton;
    }

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

        if (!LofiClient.singleton) {
            LofiClient.singleton = this;
        } else {
            throw Error('LofiClient already instantiated!');
        }

        this.commandHandler = new CommandHandler(this, {
            directory: './build/main/commands/',
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
            directory: './build/main/inhibitors/'
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './build/main/listeners'
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

    async updateLeaderboard(): Promise<void> {
        this.timeLeaderboard = await this.provider.getHighest('data.totalTime', MAX_LEADERBOARD_POSITIONS);
        this.songLeaderboard = await this.provider.getHighest('data.totalSongs', MAX_LEADERBOARD_POSITIONS);
    }

    async login(token: string): Promise<string> {
        await mongoose.connect(isDevelopment? DB_URL.replace('<dbname>', 'test') : DB_URL.replace('<dbname>', 'production'), {
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
        await this.updateLeaderboard();
        this.setInterval(this.saveStats.bind(this), STATS_SAVE_INTERVAL);
        this.setInterval(this.updateLeaderboard.bind(this), LEADERBOARD_UPDATE_INTERVAL);
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

    setSongListener(listener: MemSongListener): void {
        this.songListener = listener;
    }

    getSongListener(): MemSongListener {
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
        if (this.songListener.getLastSong()) this.lastSongs.unshift(this.songListener.getLastSong());
        this.songsPlayed++;

        while (this.lastSongs.length > MAX_LAST_SONGS) {
            this.lastSongs.pop();
        }
    }

    getLastSongs(): string {
        return this.lastSongs.reduce((prev, current, index) => prev + (index + 1) + '. ' + current + '\n', '');
    }

    getCommandHandler(): CommandHandler {
        return this.commandHandler;
    }

    getSongLeaderboard(): ServerDocument[] {
        return this.songLeaderboard;
    }

    getTimeLeaderboard(): ServerDocument[] {
        return this.timeLeaderboard;
    }
}
