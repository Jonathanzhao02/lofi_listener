import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';
import Server from '../Server';

export default class SongChangeListener extends Listener {
    client: LofiClient;

    constructor() {
        super('songchange', {
            emitter: 'songChangeListener',
            event: 'change'
        });
    }

    exec(): void {
        this.client.pushLastSong();

        this.client.foreachServer((server: Server): void => {
            if (server.getConnected()) server.incrementSongsPlayed();
            if (server.getNotificationsOn() && server.getConnected()) {
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
            }
        });
    }
}
