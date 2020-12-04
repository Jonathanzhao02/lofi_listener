import ***REMOVED*** Listener ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class SongChangeListener extends Listener ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('songchange', ***REMOVED***
            emitter: 'songChangeListener',
            event: 'change'
        ***REMOVED***);
    ***REMOVED***

    exec(current: string): void ***REMOVED***
        this.client.incrementSongsPlayed();
        this.client.broadcastMessage(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Now Playing')
                .attachFiles(['resources/latest.gif'])
                .setDescription(current)
        );
    ***REMOVED***
***REMOVED***
