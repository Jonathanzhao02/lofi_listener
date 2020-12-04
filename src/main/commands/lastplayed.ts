import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class LastPlayedCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('lastplayed', ***REMOVED***
           aliases: ['lastplayed', 'lastplaying', 'lp'],
           description: 'Get the last played song.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        message.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('⏪ Last Played')
                .attachFiles(['resources/latest_old.gif'])
                .setDescription(this.client.getSongListener().getLastSong())
        );
    ***REMOVED***
***REMOVED***
