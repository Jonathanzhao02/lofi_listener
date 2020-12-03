// import * as ytdl from 'discord-ytdl-core';
import ***REMOVED*** MessageEmbed, TextChannel ***REMOVED*** from 'discord.js';
import ***REMOVED*** getInfo, videoFormat ***REMOVED*** from 'ytdl-core';
import Command from './Command';
import DiscordClient from './DiscordClient';
import SongChangeListener from './SongChangeListener';

const VID_URL: string = 'https://www.youtube.com/watch?v=DWcJFNfaw9c'; // LOFI HIP HOP SLEEP TO

function nextBestFormat(formats: videoFormat[], isLive: boolean): videoFormat ***REMOVED***
	let filter = (format: videoFormat): boolean => format.audioBitrate && true;
	if (isLive) filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS;
	formats = formats
		.filter(filter)
		.sort((a, b) => b.audioBitrate - a.audioBitrate);
	return formats.find(format => !format.bitrate) || formats[0];
***REMOVED***

const main = async (): Promise<void> => ***REMOVED***
    const info = await getInfo(VID_URL);
    const bestFormat = nextBestFormat(info.formats, info.player_response.videoDetails.isLiveContent);
    const client = new DiscordClient();
    client.broadcastSound(bestFormat.url);

    // const stream = ytdl.arbitraryStream(bestFormat.url, ***REMOVED*** filter: 'audioonly', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10'], ***REMOVED***);

    const songChangeListener = new SongChangeListener(bestFormat.url);
    songChangeListener.init();
    songChangeListener.on('change', (current) => ***REMOVED***
        client.broadcastMessage(`Now Playing: $***REMOVED***current***REMOVED***`);
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
                client.unregisterGuild(msg.guild);
            ***REMOVED***);
        ***REMOVED***);
        if (msg.channel instanceof TextChannel) client.registerGuild(msg.guild, msg.channel, msg.member.voice.channel);
    ***REMOVED***);

    const npCommand = new Command(['nowplaying', 'np'], (client, msg) => ***REMOVED***
        msg.channel.send(songChangeListener.getCurrentSong());
    ***REMOVED***);

    const lpCommand = new Command(['lastplayed', 'lp'], (client, msg) => ***REMOVED***
        msg.channel.send(songChangeListener.getLastSong());
    ***REMOVED***);

    const startCommand = new Command(['start'], (client, msg) => ***REMOVED***
        if (msg.channel instanceof TextChannel) ***REMOVED***
            msg.channel.send('Will now send updates.');
            client.registerGuildText(msg.guild, msg.channel);
        ***REMOVED***
    ***REMOVED***);

    const stopCommand = new Command(['stop'], (client, msg) => ***REMOVED***
        msg.channel.send('Will no longer send updates.');
        client.unregisterGuildText(msg.guild);
    ***REMOVED***);

    const leaveCommand = new Command(['leave'], (client, msg) => ***REMOVED***
        msg.guild.me.voice.channel.leave();
        client.unregisterGuild(msg.guild);
    ***REMOVED***);

    const statCommand = new Command(['stats', 'uptime', 'info'], (client, msg) => ***REMOVED***
        msg.channel.send(
            new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('📊 Stats')
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
