import ***REMOVED*** Listener ***REMOVED*** from 'discord-akairo';
import LofiClient from '../LofiClient';

export default class ReadyListener extends Listener ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('guildcreate', ***REMOVED***
            emitter: 'client',
            event: 'guildCreate'
        ***REMOVED***);
    ***REMOVED***

    async exec(guild): Promise<void> ***REMOVED***
        await this.client.provider.getDocument(guild.id);
    ***REMOVED***
***REMOVED***
