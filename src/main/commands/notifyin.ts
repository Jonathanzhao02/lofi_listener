import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class NotifyInCommand extends Command {
    client: LofiClient;

    constructor() {
        super('notifyin', {
           aliases: ['notifyin', 'notify'],
           category: 'Util',
           description: 'Send notifications to a certain channel.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 5000
        });
    }

    async exec(message: Message): Promise<Message> {
        const text = message.mentions?.channels?.first();
        if (!text) return message.channel.send('No valid channel found.');
        await this.client.provider.set(message.guild.id, 'settings.notificationChannel', text.id);
        this.client.getServer(message.guild.id)?.setNotificationChannel(text);
        return message.channel.send('✅ Will now send updates there.');
    }
}
