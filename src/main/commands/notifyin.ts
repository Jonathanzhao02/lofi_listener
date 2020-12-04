import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class NotifyInCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('notifyin', ***REMOVED***
           aliases: ['notifyin', 'notify'],
           description: 'Send notifications to a certain channel.',
           channel: 'guild',
           cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    exec(message: Message): void ***REMOVED***
        const text = message.mentions?.channels?.first();
        message.channel.send('✅ Will now send updates there.');
        this.client.getServer(message.guild.id)?.setNotificationChannel(text);
    ***REMOVED***
***REMOVED***
