import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient, ***REMOVED*** Server ***REMOVED*** from '../LofiClient';

export default class JoinCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('join', ***REMOVED***
           aliases: ['join', 'play', 'p'],
           description: 'Join the bot to a user\'s voice channel.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        if (!message.member.voice.channel) ***REMOVED***
            message.channel.send('You\'re not in a voice channel?');
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
                this.client.removeServer(message.guild);
            ***REMOVED***);
        ***REMOVED***);
        if (!this.client.hasServer(message.guild)) ***REMOVED***
            const server = new Server();
            server.setNotificationChannel(message.channel);
            server.setVoiceChannel(message.member.voice.channel);
            this.client.addServer(message.guild, server);
        ***REMOVED***
    ***REMOVED***
***REMOVED***
