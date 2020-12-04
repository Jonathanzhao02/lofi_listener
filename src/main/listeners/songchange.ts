import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import LofiClient from '../LofiClient';

export default class SongChangeListener extends Listener {
    client: LofiClient;

    constructor() {
        super('songchange', {
            emitter: 'songChangeListener',
            event: 'change'
        });
    }

    exec(current: string): void {
        this.client.incrementSongsPlayed();
        this.client.broadcastMessage(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Now Playing')
                .attachFiles(['resources/latest.gif'])
                .setDescription(current)
        );
    }
}
