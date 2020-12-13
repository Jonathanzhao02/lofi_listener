import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class LeaveCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('leave', ***REMOVED***
           aliases: ['leave'],
           category: 'Music',
           description: 'Leave the bot from a user\'s voice channel.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 5000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        if (message.guild.me.voice.channel) ***REMOVED***
            message.guild.me.voice.channel.leave();
        ***REMOVED*** else ***REMOVED***
            message.channel.send('Not in a voice channel.');
        ***REMOVED***
    ***REMOVED***
***REMOVED***
