import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class PingCommand extends Command {
    client: LofiClient;

    constructor() {
        super('quit', {
           aliases: ['quit', 'exit'],
           description: 'Shut down the bot.',
           ownerOnly: true,
           channel: 'dm'
        });
    }

    async exec(message: Message): Promise<void> {
        await message.reply('Quitting');
        await this.client.saveStats();
        return this.client.destroy();
    }
}
