import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';

const ***REMOVED*** BOT_PREFIX ***REMOVED*** = require('../../../config.json');

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
            channel: 'guild',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 1000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message, args: any): Promise<Message> ***REMOVED***
        if (args.prefix.length > 1) return message.reply('Prefix must be one character!');
        const oldPrefix = this.client.provider.get(message.guild.id, 'settings.prefix', BOT_PREFIX);
        await this.client.provider.set(message.guild.id, 'settings.prefix', args.prefix);
        this.client.getServer(message.guild.id)?.setPrefix(args.prefix);
        return message.reply(`Prefix changed from $***REMOVED***oldPrefix***REMOVED*** to $***REMOVED***args.prefix***REMOVED***.`);
    ***REMOVED***
***REMOVED***
