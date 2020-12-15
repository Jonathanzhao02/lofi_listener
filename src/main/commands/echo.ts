import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class EchoCommand extends Command {
    constructor() {
        super('echo', {
           aliases: ['echo'],
           category: 'admin',
           description: 'Echo! echo! echo.',
           ownerOnly: true
        });
    }

    exec(message: Message): void {
        console.log(message.content);
    }
}
