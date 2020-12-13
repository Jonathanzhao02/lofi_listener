import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';
import * as fs from 'fs';

export default class NowPlayingCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('nowplaying', ***REMOVED***
           aliases: ['nowplaying', 'np'],
           description: 'Get the currently playing song.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
           cooldown: 5000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        const embed = new MessageEmbed()
            .setColor('#66ccff')
            .setTitle('▶️ Now Playing')
            .setDescription(this.client.getSongListener().getCurrentSong());

        const server = this.client.getServer(message.guild.id);

        if (server.getUseGifs() && fs.existsSync('temp/latest.gif')) ***REMOVED***
            embed.attachFiles(['temp/latest.gif']);
        ***REMOVED*** else if (fs.existsSync('temp/latest.jpg')) ***REMOVED***
            embed.attachFiles(['temp/latest.jpg']);
        ***REMOVED***

        message.channel.send(embed);
    ***REMOVED***
***REMOVED***
