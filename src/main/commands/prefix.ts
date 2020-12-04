import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

const ***REMOVED*** BOT_PREFIX ***REMOVED*** = require('../../config.json');

export default class PingCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('prefix', ***REMOVED***
           aliases: ['prefix'],
           description: 'Set the bot\'s server prefix.',
           args: [
                ***REMOVED***
                    id: 'prefix',
                    default: BOT_PREFIX
                ***REMOVED***
            ],
            channel: 'guild'
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message, args: any): Promise<Message> ***REMOVED***
        const oldPrefix = this.client.settings.get(message.guild.id, 'prefix', BOT_PREFIX);
        await this.client.settings.set(message.guild.id, 'prefix', args.prefix);
        return message.reply(`Prefix changed from $***REMOVED***oldPrefix***REMOVED*** to $***REMOVED***args.prefix***REMOVED***.`);
    ***REMOVED***
***REMOVED***
