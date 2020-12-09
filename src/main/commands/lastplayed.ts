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
           clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
           cooldown: 5000
        });
    }

    exec(message: Message): void {
        const embed = new MessageEmbed()
            .setColor('#66ccff')
            .setTitle('⏪ Last Played')
            .setDescription(this.client.getLastSongs() || 'None');

        const server = this.client.getServer(message.guild.id);

        if (server.getUseGifs()) {
            embed.attachFiles(['resources/latest_old.gif']);
        } else {
            embed.attachFiles(['resources/latest_old.jpg']);
        }

        message.channel.send(embed);
    }
}
