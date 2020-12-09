import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class NotifsOffCommand extends Command {
    client: LofiClient;

    constructor() {
        super('notifsoff', {
           aliases: ['stopnotifications', 'notifsoff', 'notificationsoff'],
           description: 'Turn off notifications when the song changes.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        });
    }

    async exec(message: Message): Promise<Message> {
        const server = this.client.getServer(message.guild.id);

        if (server.getNotificationsOn()) {
            server.setNotificationsOn(false);
            await this.client.provider.set(message.guild.id, 'settings.notificationsOn', false);
            return message.channel.send('❌ Will no longer send updates.');
        }
    }
}
