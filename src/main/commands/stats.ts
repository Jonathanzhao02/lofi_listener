import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import LofiClient from '../LofiClient';

export default class StatsCommand extends Command {
    client: LofiClient;

    constructor() {
        super('stats', {
           aliases: ['stats', 'uptime'],
           description: 'Displays stats about the bot.',
           channel: 'guild',
           cooldown: 1000
        });
    }

    exec(message: Message): void {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('📊 Stats')
            .addField('🎶 Songs Played', this.client.getSongsPlayed())
            .addField('⏱️ Runtime', this.client.etime())
            .addField('📅 Up Since', this.client.getStartDate().toUTCString());

        if (this.client.hasServer(message.guild.id)) {
            embed
                .addField('\u200B', '\u200B')
                .addField('👨 You\'ve been listening for', this.client.getServer(message.guild.id).etime());
        }

        message.channel.send(
            embed
        );
    }
}
