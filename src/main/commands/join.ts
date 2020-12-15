import { Command } from 'discord-akairo';
import { Message, DMChannel, Permissions } from 'discord.js';
import LofiClient from '../LofiClient';

export default class JoinCommand extends Command {
    client: LofiClient;

    constructor() {
        super('join', {
           aliases: ['join', 'play', 'p'],
           category: 'Music',
           description: 'Join the bot to a user\'s voice channel.',
           channel: 'guild',
           cooldown: 1000
        });

        this.clientPermissions = function(message: Message): string[] {
            if (message.channel instanceof DMChannel) return;

            let missingPermissions = [];
    
            if (!message.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES)) {
                missingPermissions.push('SEND_MESSAGES');
            }
    
            if (!message.member.voice.channel?.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT)) {
                missingPermissions.push('CONNECT');
            }
    
            if (!message.member.voice.channel?.permissionsFor(this.client.user).has(Permissions.FLAGS.SPEAK)) {
                missingPermissions.push('SPEAK');
            }
    
            if (missingPermissions.length === 0) {
                return null;
            } else {
                return missingPermissions;
            }
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

        const server = this.client.getServer(message.guild.id);
        server.setConnected(false);
        server.setVoiceChannel(message.member.voice.channel);
        message.guild.me.voice.setSelfMute(false);
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
                server.addSessionTime();
                server.setConnected(false);
                server.setVoiceChannel(null);
            });

            server.setConnected(true);
        })
        .catch(reason => {
            console.log(reason);
            message.reply('Could not join your voice channel.');
            this.client.getServer(message.guild.id)?.setVoiceChannel(null);
        });
    }
}
