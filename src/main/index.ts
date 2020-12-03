// import * as ytdl from 'discord-ytdl-core';
import { MessageEmbed, TextChannel } from 'discord.js';
import { getInfo, videoFormat } from 'ytdl-core';
import Command from './Command';
import DiscordClient from './DiscordClient';
import SongChangeListener from './SongChangeListener';

const VID_URL: string = 'https://www.youtube.com/watch?v=DWcJFNfaw9c'; // LOFI HIP HOP SLEEP TO

function getBestFormat(url: string): Promise<string> {
    return new Promise<string>(resolve => {
        getInfo(VID_URL).then(info => {
            let formats = info.formats;
            const filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS;
            formats = formats
                .filter(filter)
                .sort((a, b) => b.audioBitrate - a.audioBitrate);
            resolve((formats.find(format => !format.bitrate) || formats[0]).url);
        });
    });
}

const main = async (): Promise<void> => {
    const url = await getBestFormat(VID_URL);
    const client = new DiscordClient();
    client.broadcastSound(url);

    // const stream = ytdl.arbitraryStream(bestFormat.url, { filter: 'audioonly', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10'], });

    const songChangeListener = new SongChangeListener(url);
    songChangeListener.init();
    songChangeListener.on('change', (current) => {
        client.broadcastMessage(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Now Playing')
                .attachFiles(['latest.gif'])
                .setDescription(current)
        );
    });

    const joinCommand = new Command(['play', 'join', 'p'], (client, msg) => {
        if (!msg.member.voice.channel) return msg.channel.send('You\'re not in a voice channel?');
        msg.member.voice.channel.join()
        .then(connection => {
            let dispatcher = connection.play(client.getBroadcast(), {
                type: 'opus'
            })
            .on('finish', () => {
                dispatcher.destroy();
                msg.guild.me.voice.channel.leave();
            });

            connection.on('disconnect', () => {
                dispatcher.destroy();
                client.removeGuild(msg.guild);
            });
        });
        if (msg.channel instanceof TextChannel) client.addGuild(msg.guild, msg.channel, msg.member.voice.channel);
    });

    const npCommand = new Command(['nowplaying', 'np'], (client, msg) => {
        msg.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Currently Playing')
                .attachFiles(['latest.gif'])
                .setDescription(songChangeListener.getCurrentSong())
        );
    });

    const lpCommand = new Command(['lastplayed', 'lp'], (client, msg) => {
        msg.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('⏪ Last Played')
                .attachFiles(['latest_old.gif'])
                .setDescription(songChangeListener.getLastSong())
        );
    });

    const startCommand = new Command(['start'], (client, msg) => {
        if (msg.channel instanceof TextChannel) {
            msg.channel.send('✅ Will now send updates.');
            const guildConstruct = client.getGuild(msg.guild);
            if (guildConstruct) guildConstruct.text = msg.channel;
        }
    });

    const stopCommand = new Command(['stop'], (client, msg) => {
        msg.channel.send('❌ Will no longer send updates.');
        const guildConstruct = client.getGuild(msg.guild);
        if (guildConstruct) guildConstruct.text = null;
    });

    const leaveCommand = new Command(['leave'], (client, msg) => {
        msg.guild.me.voice.channel.leave();
        client.removeGuild(msg.guild);
    });

    const statCommand = new Command(['stats', 'uptime', 'info'], (client, msg) => {
        msg.channel.send(
            new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('📊 Stats')
                .addField('🎶 Songs Played', songChangeListener.getSongsPlayed())
                .addField('⏱️ Runtime', client.etime())
                .addField('📅 Up Since', client.getStartDate().toUTCString())
        );
    });

    client.registerCommands([joinCommand, npCommand, lpCommand, startCommand, stopCommand, leaveCommand, statCommand]);

    process.on('SIGINT', () => {
        songChangeListener.end();
        console.log('Logging out');
        client.destroy();
        process.exit(0);
    });
};

main();
