import { MessageEmbed, TextChannel, NewsChannel, DMChannel, VoiceChannel, Message, Snowflake, Permissions } from 'discord.js';
import LofiClient from './LofiClient';
import ServerMongooseProvider from './providers/ServerMongooseProvider';

type TextBasedChannel = TextChannel | NewsChannel | DMChannel;

export default class Server {
    private notificationChannel: TextBasedChannel;
    private voiceChannel: VoiceChannel;
    private startTime: number;
    private connected: boolean;
    private id: Snowflake;
    private client: LofiClient;

    private sessionTime: number;
    private sessionSongs: number;

    private notificationsOn: boolean;
    private prefix: string;
    private useGifs: boolean;
    private totalSongs: number;
    private totalTime: number;

    private static provider: ServerMongooseProvider;

    static setProvider(provider: ServerMongooseProvider): void {
        Server.provider = provider;
    }

    constructor(client: LofiClient) {
        this.client = client;
    }

    async init(message: Message): Promise<void> {
        this.id = message.guild.id;
        const { settings, data } = await Server.provider.getDocument(this.id);

        this.prefix = settings.prefix;
        this.useGifs = settings.useGifs;
        this.notificationsOn = settings.notificationsOn;

        const channel = message.guild.channels.resolve(settings.notificationChannel);
        
        if (channel) {
            this.notificationChannel = channel as TextBasedChannel;
        } else {
            this.notificationChannel = message.channel;
        }

        this.totalTime = data.totalTime;
        this.totalSongs = data.totalSongs;

        this.sessionTime = 0;
        this.sessionSongs = 0;

        this.connected = false;
    }

    addSessionTime(): void {
        if (!isNaN(this.startTime)) this.sessionTime += Date.now() - this.startTime;
    }

    setConnected(on: boolean): void {
        if (on) {
            this.startTime = Date.now();
        }

        this.connected = on;
    }

    getConnected(): boolean {
        return this.connected;
    }

    setNotificationChannel(channel: TextBasedChannel): void {
        this.notificationChannel = channel;
    }

    sendNotification(msg: string | MessageEmbed): boolean {
        if (this.notificationsOn) {
            if (!(this.notificationChannel instanceof DMChannel) && this.notificationChannel?.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES)) {
                this.notificationChannel?.send(msg);
            }
        }

        return this.notificationsOn;
    }

    setNotificationsOn(on: boolean): void {
        this.notificationsOn = on;
    }

    getNotificationsOn(): boolean {
        return this.notificationsOn;
    }

    getNotificationsChannel(): TextBasedChannel {
        return this.notificationChannel;
    }

    incrementSongsPlayed(): number {
        return this.sessionSongs++;
    }

    getSongsPlayed(): number {
        return this.sessionSongs;
    }

    getTotalSongsPlayed(): number {
        return this.sessionSongs + this.totalSongs;
    }

    etime(): number {
        return this.sessionTime + (this.connected ? Date.now() - this.startTime : 0);
    }

    totalEtime(): number {
        return this.totalTime + this.etime();
    }

    setPrefix(prefix: string): void {
        this.prefix = prefix;
    }

    getPrefix(): string {
        return this.prefix;
    }

    setUseGifs(on: boolean): void {
        this.useGifs = on;
    }

    getUseGifs(): boolean {
        return this.useGifs;
    }

    setVoiceChannel(channel: VoiceChannel): void {
        this.voiceChannel = channel;
    }
}
