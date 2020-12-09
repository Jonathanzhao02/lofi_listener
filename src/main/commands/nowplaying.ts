import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import LofiClient from '../LofiClient';

export default class NowPlayingCommand extends Command {
    client: LofiClient;

    constructor() {
        super('nowplaying', {
           aliases: ['nowplaying', 'np'],
           description: 'Get the currently playing song.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
           cooldown: 5000
        });
    }

    exec(message: Message): void {
        const embed = new MessageEmbed()
            .setColor('#66ccff')
            .setTitle('▶️ Now Playing')
            .setDescription(this.client.getSongListener().getCurrentSong());

        const server = this.client.getServer(message.guild.id);

        if (server.getUseGifs()) {
            embed.attachFiles(['resources/latest.gif']);
        } else {
            embed.attachFiles(['resources/latest.jpg']);
        }

        message.channel.send(embed);
    }
}
