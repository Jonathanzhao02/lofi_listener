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
           cooldown: 5000
        });
    }

    exec(message: Message): void {
        message.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Currently Playing')
                .attachFiles(['resources/latest.gif'])
                .setDescription(this.client.getSongListener().getCurrentSong())
        );
    }
}
