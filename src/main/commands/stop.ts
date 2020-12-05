import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class StopCommand extends Command {
    client: LofiClient;

    constructor() {
        super('stop', {
           aliases: ['stop', 'notifsoff'],
           description: 'Turn off notifications when the song changes.',
           channel: 'guild',
           cooldown: 1000
        });
    }

    async exec(message: Message): Promise<Message> {
        const server = this.client.getServer(message.guild.id);

        if (server?.getNotifications()) {
            this.client.getServer(message.guild.id)?.setNotifications(false);
            await this.client.provider.set(message.guild.id, 'settings.notificationsOn', false);
            return message.channel.send('❌ Will no longer send updates.');
        }
    }
}
