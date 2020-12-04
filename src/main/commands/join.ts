import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import LofiClient, { Server } from '../LofiClient';

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
                this.client.removeServer(message.guild);
            });
        });
        if (!this.client.hasServer(message.guild)) {
            const server = new Server();
            server.setNotificationChannel(message.channel);
            server.setVoiceChannel(message.member.voice.channel);
            this.client.addServer(message.guild, server);
        }
    }
}
