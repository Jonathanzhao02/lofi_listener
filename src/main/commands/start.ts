import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class StartCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('start', ***REMOVED***
           aliases: ['start', 'notifson'],
           description: 'Turn on notifications when the song changes.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<Message> ***REMOVED***
        const server = this.client.getServer(message.guild.id);

        if (!server?.getNotifications()) ***REMOVED***
            this.client.getServer(message.guild.id)?.setNotifications(true);
            await this.client.provider.set(message.guild.id, 'settings.notificationsOn', true);
            return message.channel.send('✅ Will now send updates.');
        ***REMOVED***
    ***REMOVED***
***REMOVED***
