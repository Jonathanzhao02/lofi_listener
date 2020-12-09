import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import LofiClient from '../LofiClient';
import { etimeLabeled } from '../util/etime';

async function resolveGuildName(id: string, client: LofiClient): Promise<string> {
    try{
        const guild = await client.guilds.fetch(id);
        return guild.name;
    } catch {
        return '???';
    }
}

export default class LeaderboardsCommand extends Command {
    client: LofiClient;

    constructor() {
        super('leaderboards', {
           aliases: ['leaderboards', 'leaderboard', 'lb'],
           description: 'Show the servers with the top totals.',
           channel: 'guild',
           clientPermissions: ['SEND_MESSAGES'],
           cooldown: 5000
        });
    }

    async exec(message: Message): Promise<Message> {
        const timeLeaderboard = this.client.getTimeLeaderboard();
        const songLeaderboard = this.client.getSongLeaderboard();
        const embed = new MessageEmbed()
            .setColor('#ffd700')
            .setTitle('Leaderboards');

        embed.addField('\u200B', '🌟Top Time Listened🌟');
        
        for (let i = 0; i < timeLeaderboard.length; i++) {
            embed.addField(`${i+1}. ${await resolveGuildName(timeLeaderboard[i].id, this.client)}`, etimeLabeled(timeLeaderboard[i].data.totalTime));
        }

        embed.addField('\u200B', '🌟Top Songs Listened🌟');

        for (let i = 0; i < songLeaderboard.length; i++) {
            embed.addField(`${i+1}. ${await resolveGuildName(songLeaderboard[i].id, this.client)}`, `${songLeaderboard[i].data.totalSongs} songs`);
        }

        return message.channel.send(embed);
    }
}
