import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class LastPlayedCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('lastplayed', ***REMOVED***
           aliases: ['lastplayed', 'lastplaying', 'lp'],
           description: 'Get the last played songs.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
           cooldown: 5000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        const embed = new MessageEmbed()
            .setColor('#66ccff')
            .setTitle('⏪ Last Played')
            .setDescription(this.client.getLastSongs() || 'None');

        const server = this.client.getServer(message.guild.id);

        if (server.getUseGifs()) ***REMOVED***
            embed.attachFiles(['resources/latest_old.gif']);
        ***REMOVED*** else ***REMOVED***
            embed.attachFiles(['resources/latest_old.jpg']);
        ***REMOVED***

        message.channel.send(embed);
    ***REMOVED***
***REMOVED***
