import ***REMOVED*** Listener ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';
import Server from '../Server';

export default class SongChangeListener extends Listener ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('songchange', ***REMOVED***
            emitter: 'songChangeListener',
            event: 'change'
        ***REMOVED***);
    ***REMOVED***

    exec(): void ***REMOVED***
        this.client.pushLastSong();

        this.client.foreachServer((server: Server): void => ***REMOVED***
            if (server.getNotificationsOn() && server.getConnected()) ***REMOVED***
                const cmdHandler = this.client.getCommandHandler();
                cmdHandler.runCommand(
                        new Message(
                        this.client,
                        null,
                        server.getNotificationsChannel()
                    ),
                    cmdHandler.findCommand('nowplaying'),
                    null
                );
                server.incrementSongsPlayed();
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
***REMOVED***
