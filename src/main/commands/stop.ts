import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
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

    exec(message: Message): void {
        message.channel.send('❌ Will no longer send updates.');
        this.client.getServer(message.guild.id)?.setNotifications(false);
    }
}
