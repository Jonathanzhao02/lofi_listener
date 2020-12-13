import ***REMOVED*** MessageEmbed, TextChannel, NewsChannel, DMChannel, VoiceChannel, Message, Snowflake, Permissions ***REMOVED*** from 'discord.js';
import LofiClient from './LofiClient';
import ServerMongooseProvider from './providers/ServerMongooseProvider';

type TextBasedChannel = TextChannel | NewsChannel | DMChannel;

export default class Server ***REMOVED***
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

    static setProvider(provider: ServerMongooseProvider): void ***REMOVED***
        Server.provider = provider;
    ***REMOVED***

    constructor(client: LofiClient) ***REMOVED***
        this.client = client;
    ***REMOVED***

    async init(message: Message): Promise<void> ***REMOVED***
        this.id = message.guild.id;
        const ***REMOVED*** settings, data ***REMOVED*** = await Server.provider.getDocument(this.id);

        this.prefix = settings.prefix;
        this.useGifs = settings.useGifs;
        this.notificationsOn = settings.notificationsOn;

        const channel = message.guild.channels.resolve(settings.notificationChannel);
        
        if (channel) ***REMOVED***
            this.notificationChannel = channel as TextBasedChannel;
        ***REMOVED*** else ***REMOVED***
            this.notificationChannel = message.channel;
        ***REMOVED***

        this.totalTime = data.totalTime;
        this.totalSongs = data.totalSongs;

        this.sessionTime = 0;
        this.sessionSongs = 0;

        this.connected = false;
    ***REMOVED***

    setConnected(on: boolean): void ***REMOVED***
        this.connected = on;

        if (on) ***REMOVED***
            this.startTime = Date.now();
        ***REMOVED*** else ***REMOVED***
            this.sessionTime += Date.now() - this.startTime;
        ***REMOVED***

    ***REMOVED***

    getConnected(): boolean ***REMOVED***
        return this.connected;
    ***REMOVED***

    setNotificationChannel(channel: TextBasedChannel): void ***REMOVED***
        this.notificationChannel = channel;
    ***REMOVED***

    sendNotification(msg: string | MessageEmbed): boolean ***REMOVED***
        if (this.notificationsOn) ***REMOVED***
            if (!(this.notificationChannel instanceof DMChannel) && this.notificationChannel?.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES)) ***REMOVED***
                this.notificationChannel?.send(msg);
            ***REMOVED***
        ***REMOVED***

        return this.notificationsOn;
    ***REMOVED***

    setNotificationsOn(on: boolean): void ***REMOVED***
        this.notificationsOn = on;
    ***REMOVED***

    getNotificationsOn(): boolean ***REMOVED***
        return this.notificationsOn;
    ***REMOVED***

    getNotificationsChannel(): TextBasedChannel ***REMOVED***
        return this.notificationChannel;
    ***REMOVED***

    incrementSongsPlayed(): number ***REMOVED***
        return this.sessionSongs++;
    ***REMOVED***

    getSongsPlayed(): number ***REMOVED***
        return this.sessionSongs;
    ***REMOVED***

    getTotalSongsPlayed(): number ***REMOVED***
        return this.sessionSongs + this.totalSongs;
    ***REMOVED***

    etime(): number ***REMOVED***
        return this.sessionTime + (this.connected? Date.now() - this.startTime : 0);
    ***REMOVED***

    totalEtime(): number ***REMOVED***
        return this.totalTime + this.etime();
    ***REMOVED***

    setPrefix(prefix: string): void ***REMOVED***
        this.prefix = prefix;
    ***REMOVED***

    getPrefix(): string ***REMOVED***
        return this.prefix;
    ***REMOVED***

    setUseGifs(on: boolean): void ***REMOVED***
        this.useGifs = on;
    ***REMOVED***

    getUseGifs(): boolean ***REMOVED***
        return this.useGifs;
    ***REMOVED***

    setVoiceChannel(channel: VoiceChannel): void ***REMOVED***
        this.voiceChannel = channel;
    ***REMOVED***
***REMOVED***
