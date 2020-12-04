import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class LeaveCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('leave', ***REMOVED***
           aliases: ['leave'],
           description: 'Leave the bot from a user\'s voice channel.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        message.guild.me.voice.channel.leave();
        this.client.removeServer(message.guild.id);
    ***REMOVED***
***REMOVED***
