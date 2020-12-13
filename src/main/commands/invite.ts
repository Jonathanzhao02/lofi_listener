import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';

export default class InviteCommand extends Command ***REMOVED***
    constructor() ***REMOVED***
        super('invite', ***REMOVED***
           aliases: ['getinvite', 'invite', 'inv'],
           category: 'Util',
           description: 'Generate an invite to add Snowboy to your server.',
           clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
           cooldown: 5000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<Message> ***REMOVED***
        return message.reply(new MessageEmbed()
            .setTitle('Invite Snowboy!')
            .setColor('#bfff00')
            .setURL(await this.client.generateInvite())
            .setDescription('Click this embed to add Snowboy to your server.')
        );
    ***REMOVED***
***REMOVED***
