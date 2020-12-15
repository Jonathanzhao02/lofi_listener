import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class PingCommand extends Command {
    client: LofiClient;

    constructor() {
        super('quit', {
           aliases: ['quit', 'exit'],
           category: 'admin',
           description: 'Shut down the bot.',
           ownerOnly: true,
           channel: 'dm'
        });
    }

    async exec(message: Message): Promise<void> {
        await message.reply('Quitting');
        await this.client.saveStats();
        console.log('Logging out');
        return this.client.destroy();
    }
}
