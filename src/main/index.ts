import memjs from 'memjs';
import MemSongListener from './MemSongListener';
import LofiClient from './LofiClient';

const MEMCACHIER_USERNAME = process.env['MEMCACHIER_USERNAME'];
const MEMCACHIER_PASSWORD = process.env['MEMCACHIER_PASSWORD'];
const MEMCACHIER_SERVERS = process.env['MEMCACHIER_SERVERS'];
const TEST_BOT_TOKEN = process.env['TEST_BOT_TOKEN'];
const BOT_TOKEN = process.env['BOT_TOKEN'];

const isDevelopment = process.env.NODE_ENV !== 'production';

async function main(): Promise<void> {
    const client = new LofiClient();

    const memjsClient = memjs.Client.create(MEMCACHIER_SERVERS, {
        username: MEMCACHIER_USERNAME,
        password: MEMCACHIER_PASSWORD
    });

    const songChangeListener = new MemSongListener(memjsClient);
    client.registerEmitter('songChangeListener', songChangeListener);
    client.setSongListener(songChangeListener);
    client.load();
    client.login(isDevelopment? TEST_BOT_TOKEN : BOT_TOKEN);

    songChangeListener.on('url', url => {
        client.broadcastSound(url);
    });
    
    await songChangeListener.init();

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
