import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import LofiClient from '../LofiClient';
import * as fs from 'fs';

export default class NowPlayingCommand extends Command {
    client: LofiClient;

    constructor() {
        super('nowplaying', {
           aliases: ['nowplaying', 'np'],
           category: 'Music',
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
            .setDescription(this.client.getSongListener().getCurrentSong() || 'None');

        const server = this.client.getServer(message.guild.id);

        if (server.getUseGifs() && fs.existsSync('temp/latest.gif')) {
            embed.attachFiles(['temp/latest.gif']);
        } else if (fs.existsSync('temp/latest.jpg')) {
            embed.attachFiles(['temp/latest.jpg']);
        }

        message.channel.send(embed);
    }
}
