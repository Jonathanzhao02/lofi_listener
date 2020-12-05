import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class StartCommand extends Command {
    client: LofiClient;

    constructor() {
        super('start', {
           aliases: ['start', 'notifson'],
           description: 'Turn on notifications when the song changes.',
           channel: 'guild',
           cooldown: 1000
        });
    }

    async exec(message: Message): Promise<Message> {
        const server = this.client.getServer(message.guild.id);

        if (!server?.getNotifications()) {
            this.client.getServer(message.guild.id)?.setNotifications(true);
            await this.client.provider.set(message.guild.id, 'settings.notificationsOn', true);
            return message.channel.send('✅ Will now send updates.');
        }
    }
}
