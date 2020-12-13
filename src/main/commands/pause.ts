import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class LeaveCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('pause', ***REMOVED***
           aliases: ['pause', 'mute'],
           category: 'Music',
           description: 'Tell the bot to mute itself and give you some peace and quiet.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 5000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        const server = this.client.getServer(message.guild.id);

        if (message.guild.me.voice.channel !== message.member.voice.channel) ***REMOVED***
            message.channel.send('You\'re not in my voice channel.');
            return;
        ***REMOVED*** else if (!server?.getConnected()) ***REMOVED***
            message.channel.send('Not connected to a channel.');
            return;
        ***REMOVED***

        server.pause();
    ***REMOVED***
***REMOVED***
