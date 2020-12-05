import ***REMOVED*** getInfo, videoFormat ***REMOVED*** from 'ytdl-core';
import SongChangeListener from './SongChangeListener';
import LofiClient from './LofiClient';

const ***REMOVED*** TEST_BOT_TOKEN, BOT_TOKEN, STREAM_URL ***REMOVED*** = require('../config.json');
const isDevelopment = process.env.NODE_ENV.valueOf() !== 'production';

function getBestFormat(url: string): Promise<string> ***REMOVED***
    return new Promise<string>(resolve => ***REMOVED***
        getInfo(url).then(info => ***REMOVED***
            let formats = info.formats;
            const filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS;
            formats = formats
                .filter(filter)
                .sort((a, b) => b.audioBitrate - a.audioBitrate);
            resolve((formats.find(format => !format.bitrate) || formats[0]).url);
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

async function main(): Promise<void> ***REMOVED***
    const url = await getBestFormat(STREAM_URL);
    const songChangeListener = new SongChangeListener(url);
    songChangeListener.init();

    const client = new LofiClient();
    client.registerEmitter('songChangeListener', songChangeListener);
    client.setSongListener(songChangeListener);
    client.load();
    client.login(isDevelopment? TEST_BOT_TOKEN : BOT_TOKEN);
    client.broadcastSound(url);

    process.on('SIGINT', () => ***REMOVED***
        songChangeListener.end();
        console.log('Exiting');
        process.exit(0);
    ***REMOVED***);

    process.on('uncaughtException', err => ***REMOVED***
        console.log(err);
        songChangeListener.end();
        console.log('Exiting');
        process.exit(0);
    ***REMOVED***);

    process.on('unhandledRejection', err => ***REMOVED***
        console.log(err);
        songChangeListener.end();
        console.log('Exiting');
        process.exit(0);
    ***REMOVED***);
***REMOVED***

main();
