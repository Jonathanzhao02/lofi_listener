import ***REMOVED*** Listener ***REMOVED*** from 'discord-akairo';
import LofiClient from '../LofiClient';

export default class ReadyListener extends Listener ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('guilddelete', ***REMOVED***
            emitter: 'client',
            event: 'guildDelete'
        ***REMOVED***);
    ***REMOVED***

    exec(guild): void ***REMOVED***
        this.client.provider.clear(guild.id);
    ***REMOVED***
***REMOVED***
