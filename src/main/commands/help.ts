import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';

export default class HelpCommand extends Command ***REMOVED***
	constructor() ***REMOVED***
		super('help', ***REMOVED***
          aliases: ['help', 'h'],
          category: 'Util',
          args: [
            ***REMOVED***
              id: 'command',
              type: 'commandAlias',
              default: null
            ***REMOVED***
          ],
          description: 'Displays information about a command.'
		***REMOVED***);
	***REMOVED***

	exec (message: Message, ***REMOVED*** command ***REMOVED***): Promise<Message> ***REMOVED***
        const embed = new MessageEmbed().setColor(0x6577b7);

		if (command && command.categoryID.valueOf() !== 'admin') ***REMOVED***
            embed
                .setColor(3447003)
                .addField(
                    '❯ Description',
                    command.description
                );
		***REMOVED*** else ***REMOVED***
			embed
				.setTitle('❯ Commands')
				.setDescription(
					`
					A list of available commands.
					For additional info on a command, type \`help <command>\`
					`
				);

			for (const category of this.handler.categories.values()) ***REMOVED***
                if (category.id.valueOf() === 'admin') continue;
				embed.addField(
					`❯ $***REMOVED***category.id.replace(/(\b\w)/gi, (lc) =>
						lc.toUpperCase())***REMOVED*** - $***REMOVED***category.size***REMOVED***`,
					`$***REMOVED***category
						.filter((cmd) => cmd.aliases.length > 0)
						.map((cmd) => `\`$***REMOVED***cmd.aliases[0]***REMOVED***\``)
						.join(', ')***REMOVED***`
				);
			***REMOVED***
		***REMOVED***

		return message.channel.send(embed);
	***REMOVED***
***REMOVED***
