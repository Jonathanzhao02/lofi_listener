import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
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

    exec(message: Message): void ***REMOVED***
        message.channel.send('❌ Will no longer send updates.');
        this.client.getServer(message.guild)?.setNotifications(false);
    ***REMOVED***
***REMOVED***
