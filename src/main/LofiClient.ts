import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { VoiceBroadcast, Guild, MessageEmbed, TextChannel, NewsChannel, DMChannel, VoiceChannel } from 'discord.js';
import { EventEmitter } from 'events';
import SongChangeListener from './SongChangeListener';

const { BOT_PREFIX } = require('../config.json');
const MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
const MILLIS_LABELS = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];

type ServerSettings = {
    notifications: boolean
}

export class Server {
    private notificationChannel: TextChannel | NewsChannel | DMChannel;
    private voiceChannel: VoiceChannel;
    private notifications: boolean;

    constructor(settings: ServerSettings = {
        notifications: true
    }) {
        this.notifications = settings.notifications;
    }

    setNotificationChannel(channel: TextChannel | NewsChannel | DMChannel): void {
        this.notificationChannel = channel;
    }

    setVoiceChannel(channel: VoiceChannel): void {
        this.voiceChannel = channel;
    }

    getNotificationChannel(): TextChannel | NewsChannel | DMChannel {
        return this.notificationChannel;
    }

    getVoiceChannel(): VoiceChannel {
        return this.voiceChannel;
    }

    sendNotification(msg: string | MessageEmbed): boolean {
        if (this.notifications) this.notificationChannel?.send(msg);
        return this.notifications;
    }

    setNotifications(on: boolean): void {
        this.notifications = on;
    }
}

export default class LofiClient extends AkairoClient {
    private commandHandler: CommandHandler;
    private inhibitorHandler: InhibitorHandler;
    private listenerHandler: ListenerHandler;
    private broadcast: VoiceBroadcast;
    private servers: Map<Guild, Server>;
    private startTime: number;
    private songListener: SongChangeListener;
    private songsPlayed: number;

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
            prefix: BOT_PREFIX
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './build/inhibitors/'
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './build/listeners'
        });

        this.broadcast = this.voice.createBroadcast();
        this.servers = new Map<Guild, Server>();
        this.startTime = Date.now();
        this.songsPlayed = 0;

        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.registerEmitter('commandHandler', this.commandHandler);
        this.registerEmitter('inhibitorHandler', this.inhibitorHandler);
        this.registerEmitter('listenerHandler', this.listenerHandler);
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

    broadcastMessage(msg: string | MessageEmbed): void {
        this.servers.forEach(server => {
            server.sendNotification(msg);
        });
    }

    getServer(guild: Guild): Server {
        return this.servers.get(guild);
    }

    addServer(guild: Guild, server: Server): Map<Guild, Server> {
        return this.servers.set(guild, server);
    }

    hasServer(guild: Guild): boolean {
        return this.servers.has(guild);
    }

    removeServer(guild: Guild): boolean {
        return this.servers.delete(guild);
    }

    setSongListener(listener: SongChangeListener): void {
        this.songListener = listener;
    }

    getSongListener(): SongChangeListener {
        return this.songListener;
    }

    setSongsPlayed(num: number): void {
        this.songsPlayed = num;
    }

    incrementSongsPlayed(): void {
        this.songsPlayed++;
    }

    getSongsPlayed(): number {
        return this.songsPlayed;
    }

    etime(): string {
        let etime = Date.now() - this.startTime;
        const times = [];
        let result = '';

        for (let i = 0; i < MILLIS.length; i++) {
            const time = Math.floor(etime / MILLIS[i]);
            if (time > 0) {
                result = `${MILLIS_LABELS[i]}: \`${time}\``;
                break;
            }
        }

        return result;
    }

    getStartDate(): Date {
        return new Date(this.startTime);
    }

    getBroadcast(): VoiceBroadcast {
        return this.broadcast;
    }
}