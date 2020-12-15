import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class InviteCommand extends Command {
    constructor() {
        super('invite', {
           aliases: ['getinvite', 'invite', 'inv'],
           category: 'Util',
           description: 'Generate an invite to add Snowboy to your server.',
           clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
           cooldown: 5000
        });
    }

    async exec(message: Message): Promise<Message> {
        return message.reply(new MessageEmbed()
            .setTitle('Invite Snowboy!')
            .setColor('#bfff00')
            .setURL(await this.client.generateInvite())
            .setDescription('Click this embed to add Snowboy to your server.')
        );
    }
}
