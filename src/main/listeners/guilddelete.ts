import { Listener } from 'discord-akairo';
import LofiClient from '../LofiClient';

export default class ReadyListener extends Listener {
    client: LofiClient;

    constructor() {
        super('guilddelete', {
            emitter: 'client',
            event: 'guildDelete'
        });
    }

    async exec(guild): Promise<void> {
        await this.client.provider.clear(guild.id);
    }
}
