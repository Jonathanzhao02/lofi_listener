import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class NotifsOnCommand extends Command {
    client: LofiClient;

    constructor() {
        super('notifson', {
           aliases: ['startnotifications', 'notifson', 'notificationson'],
           description: 'Turn on notifications when the song changes.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        });
    }

    async exec(message: Message): Promise<Message> {
        const server = this.client.getServer(message.guild.id);

        if (!server.getNotificationsOn()) {
            server.setNotificationsOn(true);
            await this.client.provider.set(message.guild.id, 'settings.notificationsOn', true);
            return message.channel.send('✅ Will now send updates.');
        }
    }
}
