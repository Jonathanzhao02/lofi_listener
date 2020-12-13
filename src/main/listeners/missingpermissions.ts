import ***REMOVED*** Command, Listener ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class SongChangeListener extends Listener ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('missingpermissions', ***REMOVED***
            emitter: 'commandHandler',
            event: 'missingPermissions'
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message, command: Command, type: string, missing: string[]): void ***REMOVED***
        if (!missing) return;
        try ***REMOVED***
            message.reply(`Please add these permissions for \`$***REMOVED***command.id***REMOVED***\` to work: \`$***REMOVED***missing.join(', ')***REMOVED***\``);
        ***REMOVED*** catch (err) ***REMOVED***
            console.log(err);
            return;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
