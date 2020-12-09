import ***REMOVED*** AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** VoiceBroadcast, Snowflake ***REMOVED*** from 'discord.js';
import mongoose from 'mongoose';
import ***REMOVED*** EventEmitter ***REMOVED*** from 'events';
import SongChangeListener from './SongChangeListener';
import Server from './Server';
import ServerSchema from './models/ServerSchema';
import ServerMongooseProvider from './providers/ServerMongooseProvider';

const ***REMOVED*** DB_URL, STATS_SAVE_INTERVAL, BOT_PREFIX, MAX_LAST_SONGS ***REMOVED*** = require('../config.json');

export default class LofiClient extends AkairoClient ***REMOVED***
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

    constructor() ***REMOVED***
        super(
            ***REMOVED***
                ownerID: '290237225596092416'
            ***REMOVED***,
            ***REMOVED***
                messageCacheMaxSize: 0,
                messageEditHistoryMaxSize: 0
            ***REMOVED***
        );

        this.commandHandler = new CommandHandler(this, ***REMOVED***
            directory: './build/commands/',
            prefix: async (message): Promise<string> => ***REMOVED***
                if (!message.guild) return BOT_PREFIX;

                if (!this.hasServer(message.guild.id)) ***REMOVED***
                    const server = new Server(this);
                    await server.init(message);                    
                    this.addServer(message.guild.id, server);
                ***REMOVED***

                return this.getServer(message.guild.id).getPrefix();
            ***REMOVED***
        ***REMOVED***);

        this.inhibitorHandler = new InhibitorHandler(this, ***REMOVED***
            directory: './build/inhibitors/'
        ***REMOVED***);

        this.listenerHandler = new ListenerHandler(this, ***REMOVED***
            directory: './build/listeners'
        ***REMOVED***);

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
    ***REMOVED***

    async saveStats(): Promise<void> ***REMOVED***
        await this.provider.set('me', 'data.totalTime', Date.now() - this.startTime + this.totalTime);
        await this.provider.set('me', 'data.totalSongs', this.songsPlayed + this.totalSongsPlayed);

        for (const [id, server] of this.servers) ***REMOVED***
            await this.provider.set(id, 'data.totalTime', server.totalEtime());
            await this.provider.set(id, 'data.totalSongs', server.getTotalSongsPlayed());
        ***REMOVED***
    ***REMOVED***

    async login(token: string): Promise<string> ***REMOVED***
        await mongoose.connect(DB_URL, ***REMOVED***
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        ***REMOVED***);
        await this.provider.init();
        this.lastSongs = [];
        this.totalTime = this.provider.get('me', 'data.totalTime', 0);
        this.totalSongsPlayed = this.provider.get('me', 'data.totalSongs', 0);
        Server.setProvider(this.provider);
        this.setInterval(this.saveStats.bind(this), STATS_SAVE_INTERVAL);
        return super.login(token);
    ***REMOVED***

    load(): void ***REMOVED***
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();
        this.commandHandler.loadAll();
    ***REMOVED***

    registerEmitter(id: string, emitter: EventEmitter): void ***REMOVED***
        this.listenerHandler.emitters.set(id, emitter);
    ***REMOVED***

    broadcastSound(url: string): void ***REMOVED***
        this.broadcast.play(url);
    ***REMOVED***

    foreachServer(handler: (Server) => void): void ***REMOVED***
        this.servers.forEach(server => handler(server));
    ***REMOVED***

    getServer(id: Snowflake): Server ***REMOVED***
        return this.servers.get(id);
    ***REMOVED***

    addServer(id: Snowflake, server: Server): Map<Snowflake, Server> ***REMOVED***
        return this.servers.set(id, server);
    ***REMOVED***

    hasServer(id: Snowflake): boolean ***REMOVED***
        return this.servers.has(id);
    ***REMOVED***

    removeServer(id: Snowflake): boolean ***REMOVED***
        return this.servers.delete(id);
    ***REMOVED***

    setSongListener(listener: SongChangeListener): void ***REMOVED***
        this.songListener = listener;
    ***REMOVED***

    getSongListener(): SongChangeListener ***REMOVED***
        return this.songListener;
    ***REMOVED***

    getSongsPlayed(): number ***REMOVED***
        return this.songsPlayed;
    ***REMOVED***

    getTotalSongsPlayed(): number ***REMOVED***
        return this.totalSongsPlayed + this.songsPlayed;
    ***REMOVED***

    etime(): number ***REMOVED***
        return Date.now() - this.startTime;
    ***REMOVED***

    totalEtime(): number ***REMOVED***
        return Date.now() - this.startTime + this.totalTime;
    ***REMOVED***

    getStartDate(): Date ***REMOVED***
        return new Date(this.startTime);
    ***REMOVED***

    getBroadcast(): VoiceBroadcast ***REMOVED***
        return this.broadcast;
    ***REMOVED***

    pushLastSong(): void ***REMOVED***
        this.lastSongs.unshift(this.songListener.getLastSong());
        this.songsPlayed++;

        while (this.lastSongs.length > MAX_LAST_SONGS) ***REMOVED***
            this.lastSongs.pop();
        ***REMOVED***
    ***REMOVED***

    getLastSongs(): string ***REMOVED***
        return this.lastSongs.reduce((prev, current, index) => index + '. ' + prev + current + '\n', '');
    ***REMOVED***

    getCommandHandler(): CommandHandler ***REMOVED***
        return this.commandHandler;
    ***REMOVED***
***REMOVED***
