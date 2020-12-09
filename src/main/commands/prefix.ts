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
            channel: 'guild',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 1000
        });
    }

    async exec(message: Message, args: any): Promise<Message> {
        if (args.prefix.length > 1) return message.reply('Prefix must be one character!');
        const oldPrefix = this.client.provider.get(message.guild.id, 'settings.prefix', BOT_PREFIX);
        await this.client.provider.set(message.guild.id, 'settings.prefix', args.prefix);
        this.client.getServer(message.guild.id)?.setPrefix(args.prefix);
        return message.reply(`Prefix changed from ${oldPrefix} to ${args.prefix}.`);
    }
}
