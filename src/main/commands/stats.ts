import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

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
        message.channel.send(
            new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('📊 Stats')
                .addField('🎶 Songs Played', this.client.getSongsPlayed())
                .addField('⏱️ Runtime', this.client.etime())
                .addField('📅 Up Since', this.client.getStartDate().toUTCString())
        );
    ***REMOVED***
***REMOVED***
