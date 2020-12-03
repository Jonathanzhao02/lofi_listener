// import * as ytdl from 'discord-ytdl-core';
import ***REMOVED*** getInfo, videoFormat ***REMOVED*** from 'ytdl-core';
import SongChangeListener from './SongChangeListener';
import * as Discord from 'discord.js';

const ***REMOVED*** TEST_BOT_TOKEN, BOT_TOKEN ***REMOVED*** = require('../../config.json');
const isDevelopment = process.env.NODE_ENV.valueOf() !== 'production';
const client = new Discord.Client();

const VID_URL: string = 'https://www.youtube.com/watch?v=DWcJFNfaw9c'; // LOFI HIP HOP SLEEP TO
// const VID_URL: string = 'https://www.youtube.com/watch?v=xbFIL5FSHLk'; // JAPAN

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

    // const stream = ytdl.arbitraryStream(bestFormat.url, ***REMOVED*** filter: 'audioonly', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10'], ***REMOVED***);
    client.login(isDevelopment ? TEST_BOT_TOKEN : BOT_TOKEN);
    client.on('ready', () => ***REMOVED***
        console.log('Bot logged in');
    ***REMOVED***);

    const guilds = new Map<Discord.Guild, Discord.Channel>();
    const broadcast = client.voice.createBroadcast();
    broadcast.play(bestFormat.url);

    const songChangeListener = new SongChangeListener(bestFormat.url);
    songChangeListener.init();
    songChangeListener.on('change', (current) => ***REMOVED***
        guilds.forEach(val => ***REMOVED***
            if (val.isText()) val.send(`Song changed to $***REMOVED***current***REMOVED***`);
        ***REMOVED***);
    ***REMOVED***);

    client.on('message', msg => ***REMOVED***
        if (msg.author.bot || !msg.guild) return;
        guilds.set(msg.guild, msg.channel);

        if (msg.content === '&join') ***REMOVED***
            if (!msg.member.voice.channel) return msg.channel.send('You\'re not in a voice channel?');
            msg.member.voice.channel.join()
            .then(connection => ***REMOVED***
                let dispatcher = connection.play(broadcast, ***REMOVED***
                    type: 'opus'
                ***REMOVED***)
                .on('finish', () => ***REMOVED***
                    dispatcher.destroy();
                    msg.guild.me.voice.channel.leave();
                ***REMOVED***);
            ***REMOVED***);
        ***REMOVED*** else if (msg.content === '&np' || msg.content === '&nowplaying') ***REMOVED***
            msg.channel.send(songChangeListener.getCurrentSong());
        ***REMOVED*** else if (msg.content === '&lp' || msg.content === '&lastplayed') ***REMOVED***
            msg.channel.send(songChangeListener.getLastSong());
        ***REMOVED*** else if (msg.content === '&s' || msg.content === '&stop') ***REMOVED***
            if (guilds.has(msg.guild)) ***REMOVED***
                const channel = guilds.get(msg.guild);
                if (channel.isText()) channel.send('Will no longer send updates!');
            ***REMOVED***
            guilds.delete(msg.guild);
        ***REMOVED*** else if (msg.content === '&leave') ***REMOVED***
            msg.guild.me.voice.channel.leave();
        ***REMOVED***
    ***REMOVED***);

    client.on('error', err => ***REMOVED***
        console.log(err);
    ***REMOVED***);

    process.on('SIGINT', () => ***REMOVED***
        songChangeListener.end();
        console.log('Logging out');
        client.destroy();
    ***REMOVED***);
***REMOVED***;

main();
