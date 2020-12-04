import ***REMOVED*** AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** VoiceBroadcast, Guild, MessageEmbed, TextChannel, NewsChannel, DMChannel, VoiceChannel ***REMOVED*** from 'discord.js';
import ***REMOVED*** EventEmitter ***REMOVED*** from 'events';
import SongChangeListener from './SongChangeListener';

const ***REMOVED*** BOT_PREFIX ***REMOVED*** = require('../config.json');
const MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
const MILLIS_LABELS = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];

type ServerSettings = ***REMOVED***
    notifications: boolean
***REMOVED***

export class Server ***REMOVED***
    private notificationChannel: TextChannel | NewsChannel | DMChannel;
    private voiceChannel: VoiceChannel;
    private notifications: boolean;

    constructor(settings: ServerSettings = ***REMOVED***
        notifications: true
    ***REMOVED***) ***REMOVED***
        this.notifications = settings.notifications;
    ***REMOVED***

    setNotificationChannel(channel: TextChannel | NewsChannel | DMChannel): void ***REMOVED***
        this.notificationChannel = channel;
    ***REMOVED***

    setVoiceChannel(channel: VoiceChannel): void ***REMOVED***
        this.voiceChannel = channel;
    ***REMOVED***

    getNotificationChannel(): TextChannel | NewsChannel | DMChannel ***REMOVED***
        return this.notificationChannel;
    ***REMOVED***

    getVoiceChannel(): VoiceChannel ***REMOVED***
        return this.voiceChannel;
    ***REMOVED***

    sendNotification(msg: string | MessageEmbed): boolean ***REMOVED***
        if (this.notifications) this.notificationChannel?.send(msg);
        return this.notifications;
    ***REMOVED***

    setNotifications(on: boolean): void ***REMOVED***
        this.notifications = on;
    ***REMOVED***
***REMOVED***

export default class LofiClient extends AkairoClient ***REMOVED***
    private commandHandler: CommandHandler;
    private inhibitorHandler: InhibitorHandler;
    private listenerHandler: ListenerHandler;
    private broadcast: VoiceBroadcast;
    private servers: Map<Guild, Server>;
    private startTime: number;
    private songListener: SongChangeListener;
    private songsPlayed: number;

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
            prefix: BOT_PREFIX
        ***REMOVED***);

        this.inhibitorHandler = new InhibitorHandler(this, ***REMOVED***
            directory: './build/inhibitors/'
        ***REMOVED***);

        this.listenerHandler = new ListenerHandler(this, ***REMOVED***
            directory: './build/listeners'
        ***REMOVED***);

        this.broadcast = this.voice.createBroadcast();
        this.servers = new Map<Guild, Server>();
        this.startTime = Date.now();
        this.songsPlayed = 0;

        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.registerEmitter('commandHandler', this.commandHandler);
        this.registerEmitter('inhibitorHandler', this.inhibitorHandler);
        this.registerEmitter('listenerHandler', this.listenerHandler);
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

    broadcastMessage(msg: string | MessageEmbed): void ***REMOVED***
        this.servers.forEach(server => ***REMOVED***
            server.sendNotification(msg);
        ***REMOVED***);
    ***REMOVED***

    getServer(guild: Guild): Server ***REMOVED***
        return this.servers.get(guild);
    ***REMOVED***

    addServer(guild: Guild, server: Server): Map<Guild, Server> ***REMOVED***
        return this.servers.set(guild, server);
    ***REMOVED***

    hasServer(guild: Guild): boolean ***REMOVED***
        return this.servers.has(guild);
    ***REMOVED***

    removeServer(guild: Guild): boolean ***REMOVED***
        return this.servers.delete(guild);
    ***REMOVED***

    setSongListener(listener: SongChangeListener): void ***REMOVED***
        this.songListener = listener;
    ***REMOVED***

    getSongListener(): SongChangeListener ***REMOVED***
        return this.songListener;
    ***REMOVED***

    setSongsPlayed(num: number): void ***REMOVED***
        this.songsPlayed = num;
    ***REMOVED***

    incrementSongsPlayed(): void ***REMOVED***
        this.songsPlayed++;
    ***REMOVED***

    getSongsPlayed(): number ***REMOVED***
        return this.songsPlayed;
    ***REMOVED***

    etime(): string ***REMOVED***
        let etime = Date.now() - this.startTime;
        const times = [];
        let result = '';

        for (let i = 0; i < MILLIS.length; i++) ***REMOVED***
            const time = Math.floor(etime / MILLIS[i]);
            if (time > 0) ***REMOVED***
                result = `$***REMOVED***MILLIS_LABELS[i]***REMOVED***: \`$***REMOVED***time***REMOVED***\``;
                break;
            ***REMOVED***
        ***REMOVED***

        return result;
    ***REMOVED***

    getStartDate(): Date ***REMOVED***
        return new Date(this.startTime);
    ***REMOVED***

    getBroadcast(): VoiceBroadcast ***REMOVED***
        return this.broadcast;
    ***REMOVED***
***REMOVED***