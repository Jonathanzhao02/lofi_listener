import { Listener } from 'discord-akairo';
import LofiClient from '../LofiClient';

export default class ReadyListener extends Listener {
    client: LofiClient;

    constructor() {
        super('guildcreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild): Promise<void> {
        await this.client.provider.getDocument(guild.id);
    }
}
