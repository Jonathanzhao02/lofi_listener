import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';

export default class EchoCommand extends Command ***REMOVED***
    constructor() ***REMOVED***
        super('echo', ***REMOVED***
           aliases: ['echo'],
           category: 'admin',
           description: 'Echo! echo! echo.',
           ownerOnly: true
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        console.log(message.content);
    ***REMOVED***
***REMOVED***
