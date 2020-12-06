import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';
import ***REMOVED*** etimeLabeled ***REMOVED*** from '../util/etime';

export default class StatsCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('stats', ***REMOVED***
           aliases: ['stats', 'uptime'],
           description: 'Displays stats about the bot.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('📊 Stats 📊')
            .addField('\u200B', '**Current Session**')
            .addField('⏱️ Runtime', etimeLabeled(this.client.etime()))
            .addField('🎶 Songs Played', this.client.getSongsPlayed())
            .addField('📅 Up Since', this.client.getStartDate().toUTCString())
            .addField('\u200B', '**Totals**')
            .addField('⏱️ Runtime', etimeLabeled(this.client.totalEtime()))
            .addField('🎶 Songs Played', this.client.getTotalSongsPlayed());

        if (this.client.hasServer(message.guild.id)) ***REMOVED***
            const server = this.client.getServer(message.guild.id);
            embed
                .addField('\u200B', '**👨 Server Stats 👨**')
                .addField('\u200B', '**Current Session**')
                .addField('⏱️ You\'ve been listening for', etimeLabeled(server.etime()))
                .addField('🎶 You\'ve listened to', `$***REMOVED***server.getSongsPlayed()***REMOVED*** songs`)
                .addField('\u200B', '**Totals**')
                .addField('⏱️ You\'ve listened for', etimeLabeled(server.totalEtime()))
                .addField('🎶 You\'ve listened to', `$***REMOVED***server.getTotalSongsPlayed()***REMOVED*** songs`);
        ***REMOVED***

        message.channel.send(embed);
    ***REMOVED***
***REMOVED***
