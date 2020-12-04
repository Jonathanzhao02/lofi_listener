import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
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

    exec(message: Message): void ***REMOVED***
        message.channel.send('✅ Will now send updates.');
        this.client.getServer(message.guild.id)?.setNotifications(true);
    ***REMOVED***
***REMOVED***
