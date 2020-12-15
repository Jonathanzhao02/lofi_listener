import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class UseGifsCommand extends Command {
    client: LofiClient;

    constructor() {
        super('usegifs', {
           aliases: ['usegifs', 'gifs', 'gif'],
           category: 'Util',
           description: 'Use gifs for file attachments.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        });
    }

    async exec(message: Message): Promise<Message> {
        const server = this.client.getServer(message.guild.id);

        if (!server.getUseGifs()) {
            server.setUseGifs(true);
            await this.client.provider.set(message.guild.id, 'settings.useGifs', true);
            return message.channel.send('✅ Will now send gifs.');
        }
    }
}
