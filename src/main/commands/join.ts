import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient from '../LofiClient';
import Server from '../Server';

export default class JoinCommand extends Command {
    client: LofiClient;

    constructor() {
        super('join', {
           aliases: ['join', 'play', 'p'],
           description: 'Join the bot to a user\'s voice channel.',
           channel: 'guild',
           cooldown: 1000
        });
    }

    exec(message: Message): void {
        if (!message.member.voice.channel) {
            message.channel.send('You\'re not in a voice channel?');
            return;
        } else if (message.guild.me.voice.channel === message.member.voice.channel) {
            message.channel.send('Already in your voice channel.');
            return;
        }
        message.member.voice.channel.join()
        .then(connection => {
            let dispatcher = connection.play(this.client.getBroadcast(), {
                type: 'opus'
            })
            .on('finish', () => {
                dispatcher.destroy();
                message.guild.me.voice.channel.leave();
            });

            connection.on('disconnect', () => {
                dispatcher.destroy();
                this.client.getServer(message.guild.id)?.setConnected(false);
            });

            this.client.getServer(message.guild.id)?.setConnected(true);
        });
    }
}
