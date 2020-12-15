import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';

export default class LeaveCommand extends Command {
    client: LofiClient;

    constructor() {
        super('leave', {
           aliases: ['leave'],
           category: 'Music',
           description: 'Leave the bot from a user\'s voice channel.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 5000
        });
    }

    exec(message: Message): void {
        if (message.guild.me.voice.channel) {
            message.guild.me.voice.channel.leave();
        } else {
            message.channel.send('Not in a voice channel.');
        }
    }
}
