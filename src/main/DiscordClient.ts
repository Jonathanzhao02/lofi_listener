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

    constructor() ***REMOVED***
        this.client = new Discord.Client();
        this.guilds = new Map<Discord.Guild, GuildContext>();
        this.broadcast = this.client.voice.createBroadcast();
        this.registeredCommands = new Array<Command>();

        this.client.login(isDevelopment ? TEST_BOT_TOKEN : BOT_TOKEN);
        this.client.on('ready', () => ***REMOVED***
            console.log('Bot logged in');
        ***REMOVED***);

        this.client.on('error', err => ***REMOVED***
            console.log(err);
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

    broadcastMessage(msg: string): void ***REMOVED***
        this.guilds.forEach(val => ***REMOVED***
            val.text?.send(msg);
        ***REMOVED***);
    ***REMOVED***

    registerGuild(guild: Discord.Guild, text?: Discord.TextChannel, voice?: Discord.VoiceChannel): GuildContext ***REMOVED***
        const guildContext: GuildContext = ***REMOVED*** 'text': text, 'voice': voice ***REMOVED***;
        this.guilds.set(guild, guildContext);
        return guildContext;
    ***REMOVED***

    registerGuildText(guild: Discord.Guild, text: Discord.TextChannel): GuildContext ***REMOVED***
        const guildContext = this.guilds.get(guild);
        if (guildContext) guildContext.text = text;
        return guildContext;
    ***REMOVED***

    registerGuildVoice(guild: Discord.Guild, voice: Discord.VoiceChannel): GuildContext ***REMOVED***
        const guildContext = this.guilds.get(guild);
        if (guildContext) guildContext.voice = voice;
        return guildContext;
    ***REMOVED***

    unregisterGuild(guild: Discord.Guild): GuildContext ***REMOVED***
        const guildContext = this.guilds.get(guild);
        this.guilds.delete(guild);
        return guildContext;
    ***REMOVED***

    unregisterGuildText(guild: Discord.Guild): GuildContext ***REMOVED***
        const guildContext = this.guilds.get(guild);
        if (guildContext) guildContext.text = undefined;
        return guildContext;
    ***REMOVED***

    unregisterGuildVoice(guild: Discord.Guild): GuildContext ***REMOVED***
        const guildContext = this.guilds.get(guild);
        if (guildContext) guildContext.voice = undefined;
        return guildContext;
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
***REMOVED***
