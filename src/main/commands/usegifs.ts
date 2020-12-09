import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class UseGifsCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('usegifs', ***REMOVED***
           aliases: ['usegifs', 'gifs', 'gif'],
           description: 'Use gifs for file attachments.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<Message> ***REMOVED***
        const server = this.client.getServer(message.guild.id);

        if (!server.getUseGifs()) ***REMOVED***
            server.setUseGifs(true);
            await this.client.provider.set(message.guild.id, 'settings.useGifs', true);
            return message.channel.send('✅ Will now send gifs.');
        ***REMOVED***
    ***REMOVED***
***REMOVED***
