// import * as ytdl from 'discord-ytdl-core';
import ***REMOVED*** MessageEmbed, TextChannel ***REMOVED*** from 'discord.js';
import ***REMOVED*** getInfo, videoFormat ***REMOVED*** from 'ytdl-core';
import Command from './Command';
import DiscordClient from './DiscordClient';
import SongChangeListener from './SongChangeListener';

const VID_URL: string = 'https://www.youtube.com/watch?v=DWcJFNfaw9c'; // LOFI HIP HOP SLEEP TO

function getBestFormat(url: string): Promise<string> ***REMOVED***
    return new Promise<string>(resolve => ***REMOVED***
        getInfo(VID_URL).then(info => ***REMOVED***
            let formats = info.formats;
            const filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS;
            formats = formats
                .filter(filter)
                .sort((a, b) => b.audioBitrate - a.audioBitrate);
            resolve((formats.find(format => !format.bitrate) || formats[0]).url);
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

const main = async (): Promise<void> => ***REMOVED***
    const url = await getBestFormat(VID_URL);
    const client = new DiscordClient();
    client.broadcastSound(url);

    // const stream = ytdl.arbitraryStream(bestFormat.url, ***REMOVED*** filter: 'audioonly', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10'], ***REMOVED***);

    const songChangeListener = new SongChangeListener(url);
    songChangeListener.init();
    songChangeListener.on('change', (current) => ***REMOVED***
        client.broadcastMessage(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Now Playing')
                .attachFiles(['resources/latest.gif'])
                .setDescription(current)
        );
    ***REMOVED***);

    const joinCommand = new Command(['play', 'join', 'p'], (client, msg) => ***REMOVED***
        if (!msg.member.voice.channel) return msg.channel.send('You\'re not in a voice channel?');
        msg.member.voice.channel.join()
        .then(connection => ***REMOVED***
            let dispatcher = connection.play(client.getBroadcast(), ***REMOVED***
                type: 'opus'
            ***REMOVED***)
            .on('finish', () => ***REMOVED***
                dispatcher.destroy();
                msg.guild.me.voice.channel.leave();
            ***REMOVED***);

            connection.on('disconnect', () => ***REMOVED***
                dispatcher.destroy();
                client.removeGuild(msg.guild);
            ***REMOVED***);
        ***REMOVED***);
        if (msg.channel instanceof TextChannel) client.addGuild(msg.guild, msg.channel, msg.member.voice.channel);
    ***REMOVED***);

    const leaveCommand = new Command(['leave'], (client, msg) => ***REMOVED***
        msg.guild.me.voice.channel.leave();
        client.removeGuild(msg.guild);
    ***REMOVED***);

    const npCommand = new Command(['nowplaying', 'np'], (client, msg) => ***REMOVED***
        msg.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('▶️ Currently Playing')
                .attachFiles(['resources/latest.gif'])
                .setDescription(songChangeListener.getCurrentSong())
        );
    ***REMOVED***);

    const lpCommand = new Command(['lastplayed', 'lp'], (client, msg) => ***REMOVED***
        msg.channel.send(
            new MessageEmbed()
                .setColor('#66ccff')
                .setTitle('⏪ Last Played')
                .attachFiles(['resources/latest_old.gif'])
                .setDescription(songChangeListener.getLastSong())
        );
    ***REMOVED***);

    const startCommand = new Command(['start'], (client, msg) => ***REMOVED***
        if (msg.channel instanceof TextChannel) ***REMOVED***
            msg.channel.send('✅ Will now send updates.');
            const guildConstruct = client.getGuild(msg.guild);
            if (guildConstruct) guildConstruct.text = msg.channel;
        ***REMOVED***
    ***REMOVED***);

    const stopCommand = new Command(['stop'], (client, msg) => ***REMOVED***
        msg.channel.send('❌ Will no longer send updates.');
        const guildConstruct = client.getGuild(msg.guild);
        if (guildConstruct) guildConstruct.text = null;
    ***REMOVED***);

    const notifyInCommand = new Command(['notifyin'], (client, msg) => ***REMOVED***
        console.log(msg.content);
    ***REMOVED***);

    const statCommand = new Command(['stats', 'uptime', 'info'], (client, msg) => ***REMOVED***
        msg.channel.send(
            new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('📊 Stats')
                .addField('🎶 Songs Played', songChangeListener.getSongsPlayed())
                .addField('⏱️ Runtime', client.etime())
                .addField('📅 Up Since', client.getStartDate().toUTCString())
        );
    ***REMOVED***);

    client.registerCommands([joinCommand, npCommand, lpCommand, startCommand, stopCommand, leaveCommand, statCommand]);

    process.on('SIGINT', () => ***REMOVED***
        songChangeListener.end();
        console.log('Logging out');
        client.destroy();
        process.exit(0);
    ***REMOVED***);
***REMOVED***;

main();
