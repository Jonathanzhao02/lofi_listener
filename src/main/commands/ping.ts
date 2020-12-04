import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';

export default class PingCommand extends Command ***REMOVED***
    constructor() ***REMOVED***
        super('ping', ***REMOVED***
           aliases: ['ping'],
           description: 'Pong!'
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): Promise<Message> ***REMOVED***
        return message.reply('Pong!');
    ***REMOVED***
***REMOVED***
