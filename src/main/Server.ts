import { MessageEmbed, TextChannel, NewsChannel, DMChannel, VoiceChannel, Message, Snowflake } from 'discord.js';
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
        console.log(message.guild.region);
        const { settings, data } = await Server.provider.getDocument(this.id);

        this.prefix = settings.prefix;
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

        this.voiceChannel = message.member?.voice?.channel;
        this.connected = false;
    }

    setConnected(on: boolean): void {
        this.connected = on;

        if (on) {
            this.startTime = Date.now();
        } else {
            this.sessionTime += Date.now() - this.startTime;
        }

    }

    setNotificationChannel(channel: TextBasedChannel) {
        this.notificationChannel = channel;
    }

    sendNotification(msg: string | MessageEmbed): boolean {
        if (this.notificationsOn && this.connected) {
            this.notificationChannel?.send(msg);
            this.sessionSongs++;
        }
        return this.notificationsOn && this.connected;
    }

    setNotifications(on: boolean): void {
        this.notificationsOn = on;
    }

    getNotifications(): boolean {
        return this.notificationsOn;
    }

    getSongsPlayed(): number {
        return this.sessionSongs;
    }

    getTotalSongsPlayed(): number {
        return this.sessionSongs + this.totalSongs;
    }

    etime(): number {
        return this.sessionTime + (this.connected? Date.now() - this.startTime : 0);
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
}
