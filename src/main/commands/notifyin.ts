import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class NotifyInCommand extends Command {
    client: LofiClient;

    constructor() {
        super('notifyin', {
           aliases: ['notifyin', 'notify'],
           description: 'Send notifications to a certain channel.',
           channel: 'guild',
           cooldown: 1000
        });
    }

    exec(message: Message): void {
        const text = message.mentions?.channels?.first();
        message.channel.send('✅ Will now send updates there.');
        this.client.getServer(message.guild.id)?.setNotificationChannel(text);
    }
}
