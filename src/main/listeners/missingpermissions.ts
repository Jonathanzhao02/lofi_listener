import { Command, Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class SongChangeListener extends Listener {
    client: LofiClient;

    constructor() {
        super('missingpermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    exec(message: Message, command: Command, type: string, missing: string[]): void {
        if (!missing) return;
        try {
            message.reply(`Please add these permissions for \`${command.id}\` to work: \`${missing.join(', ')}\``);
        } catch (err) {
            console.log(err);
            return;
        }
    }
}
