import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class StopCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('stop', ***REMOVED***
           aliases: ['stop', 'notifsoff'],
           description: 'Turn off notifications when the song changes.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<Message> ***REMOVED***
        const server = this.client.getServer(message.guild.id);

        if (server?.getNotifications()) ***REMOVED***
            this.client.getServer(message.guild.id)?.setNotifications(false);
            await this.client.provider.set(message.guild.id, 'settings.notificationsOn', false);
            return message.channel.send('❌ Will no longer send updates.');
        ***REMOVED***
    ***REMOVED***
***REMOVED***
