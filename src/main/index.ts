import { getInfo, videoFormat } from 'ytdl-core';
import memjs from 'memjs';
import MemSongListener from './MemSongListener';
import LofiClient from './LofiClient';

const MEMCACHIER_USERNAME = process.env['MEMCACHIER_USERNAME'];
const MEMCACHIER_PASSWORD = process.env['MEMCACHIER_PASSWORD'];
const MEMCACHIER_SERVERS = process.env['MEMCACHIER_SERVERS'];
const TEST_BOT_TOKEN = process.env['TEST_BOT_TOKEN'];
const BOT_TOKEN = process.env['BOT_TOKEN'];
const STREAM_URL = process.env['STREAM_URL'];
const VID_QUALITY = process.env['VID_QUALITY'];

const isDevelopment = process.env.NODE_ENV !== 'production';

function getBestFormat(url: string): Promise<string> {
    return new Promise<string>(resolve => {
        getInfo(url).then(info => {
            let formats = info.formats;
            const filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS && format.qualityLabel === VID_QUALITY;
            formats = formats
                .filter(filter)
                .sort((a, b) => b.audioBitrate - a.audioBitrate);
            resolve((formats.find(format => !format.bitrate) || formats[0]).url);
        });
    });
}

async function main(): Promise<void> {
    const url = await getBestFormat(STREAM_URL);
    const memjsClient = memjs.Client.create(MEMCACHIER_SERVERS, {
        username: MEMCACHIER_USERNAME,
        password: MEMCACHIER_PASSWORD
    });
    const songChangeListener = new MemSongListener(memjsClient, url);
    songChangeListener.init();

    const client = new LofiClient();
    client.registerEmitter('songChangeListener', songChangeListener);
    client.setSongListener(songChangeListener);
    client.load();
    client.login(isDevelopment? TEST_BOT_TOKEN : BOT_TOKEN);
    client.broadcastSound(url);

    process.on('SIGINT', () => {
        songChangeListener.end();
        memjsClient.quit();
        console.log('Exiting');
        process.exit(0);
    });

    process.on('uncaughtException', err => {
        console.log(err);
        songChangeListener.end();
        memjsClient.quit();
        console.log('Exiting');
        process.exit(0);
    });

    process.on('unhandledRejection', err => {
        console.log(err);
        songChangeListener.end();
        memjsClient.quit();
        console.log('Exiting');
        process.exit(0);
    });
}

main();
