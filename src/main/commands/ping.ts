import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
    constructor() {
        super('ping', {
           aliases: ['ping'],
           category: 'Util',
           description: 'Pong!',
           clientPermissions: ['SEND_MESSAGES']
        });
    }

    exec(message: Message): Promise<Message> {
        return message.reply('Pong!');
    }
}
