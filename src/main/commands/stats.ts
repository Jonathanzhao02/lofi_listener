import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import LofiClient from '../LofiClient';
import { etimeLabeled } from '../util/etime';

export default class StatsCommand extends Command {
    client: LofiClient;

    constructor() {
        super('stats', {
           aliases: ['stats', 'uptime'],
           category: 'Util',
           description: 'Displays stats about the bot.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        });
    }

    exec(message: Message): void {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('📊 Stats 📊')
            .addField('\u200B', '**Current Session**')
            .addField('⏱️ Runtime', etimeLabeled(this.client.etime()))
            .addField('🎶 Songs Played', this.client.getSongsPlayed())
            .addField('📅 Up Since', this.client.readyAt.toUTCString())
            .addField('\u200B', '**Totals**')
            .addField('⏱️ Runtime', etimeLabeled(this.client.totalEtime()))
            .addField('🎶 Songs Played', this.client.getTotalSongsPlayed());

        if (this.client.hasServer(message.guild.id)) {
            const server = this.client.getServer(message.guild.id);
            embed
                .addField('\u200B', '**👨 Server Stats 👨**')
                .addField('\u200B', '**Current Session**')
                .addField('⏱️ You\'ve been listening for', etimeLabeled(server.etime()))
                .addField('🎶 You\'ve listened to', `${server.getSongsPlayed()} songs`)
                .addField('\u200B', '**Totals**')
                .addField('⏱️ You\'ve listened for', etimeLabeled(server.totalEtime()))
                .addField('🎶 You\'ve listened to', `${server.getTotalSongsPlayed()} songs`);
        }

        message.channel.send(embed);
    }
}
