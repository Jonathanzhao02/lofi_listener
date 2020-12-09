import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class NotifsOffCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('notifsoff', ***REMOVED***
           aliases: ['stopnotifications', 'notifsoff', 'notificationsoff'],
           description: 'Turn off notifications when the song changes.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<Message> ***REMOVED***
        const server = this.client.getServer(message.guild.id);

        if (server.getNotificationsOn()) ***REMOVED***
            server.setNotificationsOn(false);
            await this.client.provider.set(message.guild.id, 'settings.notificationsOn', false);
            return message.channel.send('❌ Will no longer send updates.');
        ***REMOVED***
    ***REMOVED***
***REMOVED***
