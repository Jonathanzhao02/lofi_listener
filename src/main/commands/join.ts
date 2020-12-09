import { Command } from 'discord-akairo';
import { Message, DMChannel, Permissions } from 'discord.js';
import LofiClient from '../LofiClient';

export default class JoinCommand extends Command {
    client: LofiClient;

    constructor() {
        super('join', {
           aliases: ['join', 'play', 'p'],
           description: 'Join the bot to a user\'s voice channel.',
           channel: 'guild',
           cooldown: 1000
        });

        this.clientPermissions = function(message: Message): string | string[] {
            if (message.channel instanceof DMChannel) return;
    
            if (!message.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES)) {
                return 'SEND_MESSAGES';
            }
    
            if (!message.member.voice.channel?.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT)) {
                return 'CONNECT';
            }
    
            if (!message.member.voice.channel?.permissionsFor(this.client.user).has(Permissions.FLAGS.SPEAK)) {
                return 'SPEAK';
            }
    
            return null;
        };
    }

    exec(message: Message): void {
        if (!message.member.voice.channel) {
            message.channel.send('You\'re not in a voice channel.');
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
