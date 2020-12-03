import * as Discord from 'discord.js';
import Command from './Command';

export interface GuildContext ***REMOVED***
    voice: Discord.VoiceChannel,
    text: Discord.TextChannel
***REMOVED***

const ***REMOVED*** TEST_BOT_TOKEN, BOT_TOKEN, BOT_PREFIX ***REMOVED*** = require('../../config.json');
const isDevelopment = process.env.NODE_ENV.valueOf() !== 'production';

export default class DiscordClient ***REMOVED***
    private client: Discord.Client;
    private guilds: Map<Discord.Guild, GuildContext>;
    private broadcast: Discord.VoiceBroadcast;
    private registeredCommands: Command[];
    private startTime: number;
    static readonly MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
    static readonly MILLIS_LABELS = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];

    constructor() ***REMOVED***
        this.client = new Discord.Client();
        this.guilds = new Map<Discord.Guild, GuildContext>();
        this.broadcast = this.client.voice.createBroadcast();
        this.registeredCommands = new Array<Command>();

        this.client.login(isDevelopment ? TEST_BOT_TOKEN : BOT_TOKEN);
        this.client.on('ready', () => ***REMOVED***
            console.log('Bot logged in');
            this.startTime = Date.now();
        ***REMOVED***);

        this.client.on('error', err => ***REMOVED***
            this.destroy();
        ***REMOVED***);

        this.client.on('message', msg => ***REMOVED***
            if (msg.author.bot || !msg.guild) return;
            if (!msg.content.startsWith(BOT_PREFIX)) return;
            const content = msg.content.substr(BOT_PREFIX.length).split(' ');

            for (const cmd of this.registeredCommands) ***REMOVED***
                if (cmd.check(content[0])) ***REMOVED***
                    cmd.run(this, msg, content);
                    break;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

    broadcastSound(url: string): void ***REMOVED***
        this.broadcast.play(url);
    ***REMOVED***

    broadcastMessage(msg: string | Discord.MessageEmbed): void ***REMOVED***
        this.guilds.forEach(val => ***REMOVED***
            val.text?.send(msg);
        ***REMOVED***);
    ***REMOVED***

    addGuild(guild: Discord.Guild, text?: Discord.TextChannel, voice?: Discord.VoiceChannel): GuildContext ***REMOVED***
        const guildContext: GuildContext = ***REMOVED*** 'text': text, 'voice': voice ***REMOVED***;
        this.guilds.set(guild, guildContext);
        return guildContext;
    ***REMOVED***

    removeGuild(guild: Discord.Guild): GuildContext ***REMOVED***
        const guildContext = this.guilds.get(guild);
        this.guilds.delete(guild);
        return guildContext;
    ***REMOVED***

    getGuild(guild: Discord.Guild): GuildContext ***REMOVED***
        return this.guilds.get(guild);
    ***REMOVED***

    registerCommands(cmd: Command | Command[]): void ***REMOVED***
        if (cmd instanceof Array) ***REMOVED***
            cmd.forEach(val => this.registerCommands(val));
        ***REMOVED*** else if (!this.registeredCommands.includes(cmd)) ***REMOVED***
            this.registeredCommands.push(cmd);
        ***REMOVED***
    ***REMOVED***

    getBroadcast(): Discord.VoiceBroadcast ***REMOVED***
        return this.broadcast;
    ***REMOVED***

    destroy(): void ***REMOVED***
        this.client.destroy();
    ***REMOVED***

    etime(): string ***REMOVED***
        let etime = Date.now() - this.startTime;
        const times = [];
        let result = '';

        for (let i = 0; i < DiscordClient.MILLIS.length; i++) ***REMOVED***
            const time = Math.floor(etime / DiscordClient.MILLIS[i]);
            if (time > 0) ***REMOVED***
                result = `$***REMOVED***DiscordClient.MILLIS_LABELS[i]***REMOVED***: \`$***REMOVED***time***REMOVED***\``;
                break;
            ***REMOVED***
        ***REMOVED***

        return result;
    ***REMOVED***

    getStartDate(): Date ***REMOVED***
        return new Date(this.startTime);
    ***REMOVED***
***REMOVED***
