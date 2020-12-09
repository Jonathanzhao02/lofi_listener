import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, DMChannel, Permissions ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class JoinCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('join', ***REMOVED***
           aliases: ['join', 'play', 'p'],
           description: 'Join the bot to a user\'s voice channel.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);

        this.clientPermissions = function(message: Message): string | string[] ***REMOVED***
            if (message.channel instanceof DMChannel) return;
    
            if (!message.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES)) ***REMOVED***
                return 'SEND_MESSAGES';
            ***REMOVED***
    
            if (!message.member.voice.channel?.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT)) ***REMOVED***
                return 'CONNECT';
            ***REMOVED***
    
            if (!message.member.voice.channel?.permissionsFor(this.client.user).has(Permissions.FLAGS.SPEAK)) ***REMOVED***
                return 'SPEAK';
            ***REMOVED***
    
            return null;
        ***REMOVED***;
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        if (!message.member.voice.channel) ***REMOVED***
            message.channel.send('You\'re not in a voice channel.');
            return;
        ***REMOVED*** else if (message.guild.me.voice.channel === message.member.voice.channel) ***REMOVED***
            message.channel.send('Already in your voice channel.');
            return;
        ***REMOVED***
        message.member.voice.channel.join()
        .then(connection => ***REMOVED***
            let dispatcher = connection.play(this.client.getBroadcast(), ***REMOVED***
                type: 'opus'
            ***REMOVED***)
            .on('finish', () => ***REMOVED***
                dispatcher.destroy();
                message.guild.me.voice.channel.leave();
            ***REMOVED***);

            connection.on('disconnect', () => ***REMOVED***
                dispatcher.destroy();
                this.client.getServer(message.guild.id)?.setConnected(false);
            ***REMOVED***);

            this.client.getServer(message.guild.id)?.setConnected(true);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***
