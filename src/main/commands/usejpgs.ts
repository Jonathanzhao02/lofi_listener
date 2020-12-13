import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class UseJpgsCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('usejpgs', ***REMOVED***
           aliases: ['usejpgs', 'jpgs', 'jpg'],
           category: 'Util',
           description: 'Use jpgs for file attachments.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<Message> ***REMOVED***
        const server = this.client.getServer(message.guild.id);

        if (server.getUseGifs()) ***REMOVED***
            server.setUseGifs(false);
            await this.client.provider.set(message.guild.id, 'settings.useGifs', false);
            return message.channel.send('✅ Will now send jpgs.');
        ***REMOVED***
    ***REMOVED***
***REMOVED***
