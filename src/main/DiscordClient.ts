import * as Discord from 'discord.js';
import Command from './Command';

export interface GuildContext {
    voice: Discord.VoiceChannel,
    text: Discord.TextChannel
}

const { TEST_BOT_TOKEN, BOT_TOKEN, BOT_PREFIX } = require('../../config.json');
const isDevelopment = process.env.NODE_ENV.valueOf() !== 'production';

export default class DiscordClient {
    private client: Discord.Client;
    private guilds: Map<Discord.Guild, GuildContext>;
    private broadcast: Discord.VoiceBroadcast;
    private registeredCommands: Command[];
    private startTime: number;
    static readonly MILLIS = [31557600000, 2629800000, 604800000, 86400000, 3600000, 60000, 1000];
    static readonly MILLIS_LABELS = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];

    constructor() {
        this.client = new Discord.Client();
        this.guilds = new Map<Discord.Guild, GuildContext>();
        this.broadcast = this.client.voice.createBroadcast();
        this.registeredCommands = new Array<Command>();

        this.client.login(isDevelopment ? TEST_BOT_TOKEN : BOT_TOKEN);
        this.client.on('ready', () => {
            console.log('Bot logged in');
            this.startTime = Date.now();
        });

        this.client.on('error', err => {
            this.destroy();
        });

        this.client.on('message', msg => {
            if (msg.author.bot || !msg.guild) return;
            if (!msg.content.startsWith(BOT_PREFIX)) return;
            const content = msg.content.substr(BOT_PREFIX.length).split(' ');

            for (const cmd of this.registeredCommands) {
                if (cmd.check(content[0])) {
                    cmd.run(this, msg, content);
                    break;
                }
            }
        });
    }

    broadcastSound(url: string): void {
        this.broadcast.play(url);
    }

    broadcastMessage(msg: string | Discord.MessageEmbed): void {
        this.guilds.forEach(val => {
            val.text?.send(msg);
        });
    }

    addGuild(guild: Discord.Guild, text?: Discord.TextChannel, voice?: Discord.VoiceChannel): GuildContext {
        const guildContext: GuildContext = { 'text': text, 'voice': voice };
        this.guilds.set(guild, guildContext);
        return guildContext;
    }

    removeGuild(guild: Discord.Guild): GuildContext {
        const guildContext = this.guilds.get(guild);
        this.guilds.delete(guild);
        return guildContext;
    }

    getGuild(guild: Discord.Guild): GuildContext {
        return this.guilds.get(guild);
    }

    registerCommands(cmd: Command | Command[]): void {
        if (cmd instanceof Array) {
            cmd.forEach(val => this.registerCommands(val));
        } else if (!this.registeredCommands.includes(cmd)) {
            this.registeredCommands.push(cmd);
        }
    }

    getBroadcast(): Discord.VoiceBroadcast {
        return this.broadcast;
    }

    destroy(): void {
        this.client.destroy();
    }

    etime(): string {
        let etime = Date.now() - this.startTime;
        const times = [];
        let result = '';

        for (let i = 0; i < DiscordClient.MILLIS.length; i++) {
            const time = Math.floor(etime / DiscordClient.MILLIS[i]);
            if (time > 0) {
                result = `${DiscordClient.MILLIS_LABELS[i]}: \`${time}\``;
                break;
            }
        }

        return result;
    }

    getStartDate(): Date {
        return new Date(this.startTime);
    }
}
