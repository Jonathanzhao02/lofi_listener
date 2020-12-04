import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
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

    exec(message: Message): void {
        message.channel.send('✅ Will now send updates.');
        this.client.getServer(message.guild.id)?.setNotifications(true);
    }
}
