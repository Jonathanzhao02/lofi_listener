import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

const { BOT_PREFIX } = require('../../config.json');

export default class PingCommand extends Command {
    client: LofiClient;

    constructor() {
        super('prefix', {
           aliases: ['prefix'],
           description: 'Set the bot\'s server prefix.',
           args: [
                {
                    id: 'prefix',
                    default: BOT_PREFIX
                }
            ],
            channel: 'guild'
        });
    }

    async exec(message: Message, args: any): Promise<Message> {
        const oldPrefix = this.client.settings.get(message.guild.id, 'prefix', BOT_PREFIX);
        await this.client.settings.set(message.guild.id, 'prefix', args.prefix);
        return message.reply(`Prefix changed from ${oldPrefix} to ${args.prefix}.`);
    }
}
