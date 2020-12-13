import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

export default class PingCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('quit', ***REMOVED***
           aliases: ['quit', 'exit'],
           category: 'admin',
           description: 'Shut down the bot.',
           ownerOnly: true,
           channel: 'dm'
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<void> ***REMOVED***
        await message.reply('Quitting');
        await this.client.saveStats();
        console.log('Logging out');
        return this.client.destroy();
    ***REMOVED***
***REMOVED***
