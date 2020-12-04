import ***REMOVED*** Inhibitor ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';

export default class BlacklistInhibitor extends Inhibitor ***REMOVED***
    constructor() ***REMOVED***
        super('blacklist', ***REMOVED***
            reason: 'blacklist'
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): boolean ***REMOVED***
        const blacklist = [];
        return blacklist.includes(message.author.id);
    ***REMOVED***
***REMOVED***
