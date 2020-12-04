import { getInfo, videoFormat } from 'ytdl-core';
import SongChangeListener from './SongChangeListener';
import LofiClient from './LofiClient';

const { TEST_BOT_TOKEN, BOT_TOKEN, STREAM_URL } = require('../config.json');
const isDevelopment = process.env.NODE_ENV.valueOf() !== 'production';

function getBestFormat(url: string): Promise<string> {
    return new Promise<string>(resolve => {
        getInfo(url).then(info => {
            let formats = info.formats;
            const filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS;
            formats = formats
                .filter(filter)
                .sort((a, b) => b.audioBitrate - a.audioBitrate);
            resolve((formats.find(format => !format.bitrate) || formats[0]).url);
        });
    });
}

async function main(): Promise<void> {
    const url = await getBestFormat(STREAM_URL);

    const songChangeListener = new SongChangeListener(url);
    songChangeListener.init();

    const client = new LofiClient();
    client.registerEmitter('songChangeListener', songChangeListener);
    client.setSongListener(songChangeListener);
    client.load();
    client.broadcastSound(url);
    client.login(isDevelopment? TEST_BOT_TOKEN : BOT_TOKEN);

    process.on('SIGINT', () => {
        songChangeListener.end();
        console.log('Logging out');
        client.destroy();
        process.exit(0);
    });
}

main();
