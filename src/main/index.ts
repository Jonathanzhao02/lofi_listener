// import * as ytdl from 'discord-ytdl-core';
import { getInfo, videoFormat } from 'ytdl-core';
import SongChangeListener from './SongChangeListener';
import * as Discord from 'discord.js';

const { TEST_BOT_TOKEN, BOT_TOKEN } = require('../../config.json');
const isDevelopment = process.env.NODE_ENV.valueOf() !== 'production';
const client = new Discord.Client();

const VID_URL: string = 'https://www.youtube.com/watch?v=DWcJFNfaw9c'; // LOFI HIP HOP SLEEP TO
// const VID_URL: string = 'https://www.youtube.com/watch?v=xbFIL5FSHLk'; // JAPAN

function nextBestFormat(formats: videoFormat[], isLive: boolean): videoFormat {
	let filter = (format: videoFormat): boolean => format.audioBitrate && true;
	if (isLive) filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS;
	formats = formats
		.filter(filter)
		.sort((a, b) => b.audioBitrate - a.audioBitrate);
	return formats.find(format => !format.bitrate) || formats[0];
}

const main = async (): Promise<void> => {
    const info = await getInfo(VID_URL);
    const bestFormat = nextBestFormat(info.formats, info.player_response.videoDetails.isLiveContent);

    // const stream = ytdl.arbitraryStream(bestFormat.url, { filter: 'audioonly', opusEncoded: true, encoderArgs: ['-af', 'bass=g=10'], });
    client.login(isDevelopment ? TEST_BOT_TOKEN : BOT_TOKEN);
    client.on('ready', () => {
        console.log('Bot logged in');
    });

    const guilds = new Map<Discord.Guild, Discord.Channel>();
    const broadcast = client.voice.createBroadcast();
    broadcast.play(bestFormat.url);

    const songChangeListener = new SongChangeListener(bestFormat.url);
    songChangeListener.init();
    songChangeListener.on('change', (current) => {
        guilds.forEach(val => {
            if (val.isText()) val.send(`Song changed to ${current}`);
        });
    });

    client.on('message', msg => {
        if (msg.author.bot || !msg.guild) return;
        guilds.set(msg.guild, msg.channel);

        if (msg.content === '&join') {
            if (!msg.member.voice.channel) return msg.channel.send('You\'re not in a voice channel?');
            msg.member.voice.channel.join()
            .then(connection => {
                let dispatcher = connection.play(broadcast, {
                    type: 'opus'
                })
                .on('finish', () => {
                    dispatcher.destroy();
                    msg.guild.me.voice.channel.leave();
                });
            });
        } else if (msg.content === '&np' || msg.content === '&nowplaying') {
            msg.channel.send(songChangeListener.getCurrentSong());
        } else if (msg.content === '&lp' || msg.content === '&lastplayed') {
            msg.channel.send(songChangeListener.getLastSong());
        } else if (msg.content === '&s' || msg.content === '&stop') {
            if (guilds.has(msg.guild)) {
                const channel = guilds.get(msg.guild);
                if (channel.isText()) channel.send('Will no longer send updates!');
            }
            guilds.delete(msg.guild);
        } else if (msg.content === '&leave') {
            msg.guild.me.voice.channel.leave();
        }
    });

    client.on('error', err => {
        console.log(err);
    });

    process.on('SIGINT', () => {
        songChangeListener.end();
        console.log('Logging out');
        client.destroy();
    });
};

main();
