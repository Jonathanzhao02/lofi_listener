import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class NowPlayingCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('nowplaying', ***REMOVED***
           aliases: ['nowplaying', 'np'],
           description: 'Get the currently playing song.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        message.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Currently Playing')
                .attachFiles(['resources/latest.gif'])
                .setDescription(this.client.getSongListener().getCurrentSong())
        );
    ***REMOVED***
***REMOVED***
