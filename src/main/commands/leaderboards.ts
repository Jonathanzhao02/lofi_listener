import ***REMOVED*** Command ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Message, MessageEmbed ***REMOVED*** from 'discord.js';
import LofiClient from '../LofiClient';
import ***REMOVED*** etimeLabeled ***REMOVED*** from '../util/etime';

async function resolveGuildName(id: string, client: LofiClient): Promise<string> ***REMOVED***
    try***REMOVED***
        const guild = await client.guilds.fetch(id);
        return guild.name;
    ***REMOVED*** catch ***REMOVED***
        return '???';
    ***REMOVED***
***REMOVED***

export default class LeaderboardsCommand extends Command ***REMOVED***
    client: LofiClient;

    constructor() ***REMOVED***
        super('leaderboards', ***REMOVED***
           aliases: ['leaderboards', 'leaderboard', 'lb'],
           category: 'Fun',
           description: 'Show the servers with the top totals.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 5000
        ***REMOVED***);
    ***REMOVED***

    async exec(message: Message): Promise<Message> ***REMOVED***
        const timeLeaderboard = this.client.getTimeLeaderboard();
        const songLeaderboard = this.client.getSongLeaderboard();
        const embed = new MessageEmbed()
            .setColor('#ffd700')
            .setTitle('Leaderboards');

        embed.addField('\u200B', '🌟Top Time Listened🌟');
        
        for (let i = 0; i < timeLeaderboard.length; i++) ***REMOVED***
            embed.addField(`$***REMOVED***i+1***REMOVED***. $***REMOVED***await resolveGuildName(timeLeaderboard[i].id, this.client)***REMOVED***`, etimeLabeled(timeLeaderboard[i].data.totalTime));
        ***REMOVED***

        embed.addField('\u200B', '🌟Top Songs Listened🌟');

        for (let i = 0; i < songLeaderboard.length; i++) ***REMOVED***
            embed.addField(`$***REMOVED***i+1***REMOVED***. $***REMOVED***await resolveGuildName(songLeaderboard[i].id, this.client)***REMOVED***`, `$***REMOVED***songLeaderboard[i].data.totalSongs***REMOVED*** songs`);
        ***REMOVED***

        return message.channel.send(embed
            .setFooter('Leaderboards update every hour!')
        );
    ***REMOVED***
***REMOVED***
