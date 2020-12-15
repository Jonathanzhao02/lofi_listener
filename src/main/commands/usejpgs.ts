import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class UseJpgsCommand extends Command {
    client: LofiClient;

    constructor() {
        super('usejpgs', {
           aliases: ['usejpgs', 'jpgs', 'jpg'],
           category: 'Util',
           description: 'Use jpgs for file attachments.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        });
    }

    async exec(message: Message): Promise<Message> {
        const server = this.client.getServer(message.guild.id);

        if (server.getUseGifs()) {
            server.setUseGifs(false);
            await this.client.provider.set(message.guild.id, 'settings.useGifs', false);
            return message.channel.send('✅ Will now send jpgs.');
        }
    }
}
