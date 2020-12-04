import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import LofiClient from '../LofiClient';

export default class LastPlayedCommand extends Command {
    client: LofiClient;

    constructor() {
        super('lastplayed', {
           aliases: ['lastplayed', 'lastplaying', 'lp'],
           description: 'Get the last played song.',
           channel: 'guild',
           cooldown: 1000
        });
    }

    exec(message: Message): void {
        message.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('⏪ Last Played')
                .attachFiles(['resources/latest_old.gif'])
                .setDescription(this.client.getSongListener().getLastSong())
        );
    }
}
