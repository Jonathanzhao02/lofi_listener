import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } from 'discord-akairo';
import { VoiceBroadcast, MessageEmbed, TextChannel, NewsChannel, DMChannel, VoiceChannel, Snowflake } from 'discord.js';
import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import SongChangeListener from './SongChangeListener';
import ServerSchema from './models/ServerSchema';
const { DB_URL } = require('../config.json');

const { BOT_PREFIX } = require('../config.json');
const MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
const MILLIS_LABELS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

type ServerSettings = {
    notifications: boolean
}

function etimeLabeled(startTime: number): string {
    let etime = Date.now() - startTime;
    const times = [];
    let result = '';

    for (let i = 0; i < MILLIS.length; i++) {
        const time = Math.floor(etime / MILLIS[i]);
        if (time > 0) {
            result = `\`${time}\` ${MILLIS_LABELS[i]}`;
            break;
        }
    }

    return result;
}

export class Server {
    private notificationChannel: TextChannel | NewsChannel | DMChannel;
    private voiceChannel: VoiceChannel;
    private startTime: number;
    private notifications: boolean;
    private id: Snowflake;

    constructor(id: Snowflake, settings: ServerSettings = {
        notifications: true
    }) {
        this.startTime = Date.now();
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

    etime(): string {
        return etimeLabeled(this.startTime);
    }
}

export default class LofiClient extends AkairoClient {
    private commandHandler: CommandHandler;
    private inhibitorHandler: InhibitorHandler;
    private listenerHandler: ListenerHandler;
    private broadcast: VoiceBroadcast;
    private servers: Map<Snowflake, Server>;
    private startTime: number;
    private songListener: SongChangeListener;
    private songsPlayed: number;
    readonly settings: MongooseProvider;

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
            prefix: (message) => {
                if (message.guild) {
                    return this.settings.get(message.guild.id, 'prefix', BOT_PREFIX);
                }

                return BOT_PREFIX;
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

        this.settings = new MongooseProvider(ServerSchema);
    }

    async login(token: string): Promise<string> {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        await this.settings.init();
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

    broadcastMessage(msg: string | MessageEmbed): void {
        this.servers.forEach(server => {
            server.sendNotification(msg);
        });
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
        return etimeLabeled(this.startTime);
    }

    getStartDate(): Date {
        return new Date(this.startTime);
    }

    getBroadcast(): VoiceBroadcast {
        return this.broadcast;
    }
}