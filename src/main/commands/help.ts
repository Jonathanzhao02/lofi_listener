import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class HelpCommand extends Command {
	constructor() {
		super('help', {
          aliases: ['help', 'h'],
          category: 'Util',
          args: [
            {
              id: 'command',
              type: 'commandAlias',
              default: null
            }
          ],
          description: 'Displays information about a command.'
		});
	}

	exec (message: Message, { command }): Promise<Message> {
        const embed = new MessageEmbed().setColor(0x6577b7);

		if (command && command.categoryID !== 'admin') {
            embed
                .setColor(3447003)
                .addField(
                    '❯ Description',
                    command.description
                );
		} else {
			embed
				.setTitle('❯ Commands')
				.setDescription(
					`
					A list of available commands.
					For additional info on a command, type \`help <command>\`
					`
				);

			for (const category of this.handler.categories.values()) {
                if (category.id === 'admin') continue;
				embed.addField(
					`❯ ${category.id.replace(/(\b\w)/gi, (lc) =>
						lc.toUpperCase())} - ${category.size}`,
					`${category
						.filter((cmd) => cmd.aliases.length > 0)
						.map((cmd) => `\`${cmd.aliases[0]}\``)
						.join(', ')}`
				);
			}
		}

		return message.channel.send(embed);
	}
}
