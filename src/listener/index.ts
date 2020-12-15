import memjs from 'memjs';
import { exec } from 'child_process';
import { EventEmitter } from 'events';
import { URL } from 'url';
import * as fs from 'fs';

const MEMCACHIER_USERNAME = process.env['MEMCACHIER_USERNAME'];
const MEMCACHIER_PASSWORD = process.env['MEMCACHIER_PASSWORD'];
const MEMCACHIER_SERVERS = process.env['MEMCACHIER_SERVERS'];

function extractSong(text: string): string {
    const lines = text.split('\n');
    
    for (let line of lines) {
        if (line.indexOf('-') > 0) {
            return line.trim();
        }
    }
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

function extractLatestGif(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        exec(`ffmpeg -i ${url} -hide_banner -loglevel fatal -vframes 30 -vf fps=15,scale=960:-1,select='not(mod(n\\,3))' -y temp/latest.gif`, (err, stdout, stderr) => {
            if (err || stderr) {
                console.log(`err: ${err ? err : stderr}`);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

function extractLatestFrame(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        exec(`ffmpeg -i ${url} -hide_banner -loglevel fatal -vframes 1 -y temp/latest.jpg`, (err, stdout, stderr) => {
            if (err || stderr) {
                console.log(`err: ${err ? err : stderr}`);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

function extractLatestText(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        extractLatestFrame(url).then(hasNewestFrame => {
            if (hasNewestFrame) {
                exec('python tesseract-backend/main.py temp/latest.jpg', (err, stdout, stderr) => {
                    if (err || stderr) {
                        console.log(`err: ${err ? err : stderr}`);
                        reject('Failed to run tesseract');
                    } else {
                        resolve(extractSong(stdout));
                    }
                });
            } else {
                reject('Could not extract frame');
            }
        });
    });
}

function checkValue(client, name: string, timeout = 10000, interval = 100): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = function(val: { value: Buffer, flags: Buffer }) {
            if (val?.value) {
                resolve(val.value);
            } else {
                if (Date.now() - startTime > timeout) reject('Timed out');
                else setTimeout(() => client.get(name).then(check), interval);
            }
        };

        client.get(name).then(check);
    });
}

export default class SongChangeListener extends EventEmitter {
    private url: string;
    private processId: ReturnType<typeof setTimeout>

    private currentSong: string;

    constructor(url: string) {
        super();
        if (isValidUrl(url)) this.url = url;
        else throw Error('Invalid URL supplied to SongChangeListener!');
    }

    init(): void {
        if (!fs.existsSync('temp')) fs.mkdirSync('temp');
        extractLatestText(this.url).then(song => {
            this.currentSong = song || 'Unknown';
            extractLatestGif(this.url).then(hasSavedGif => {
                this.emit('change', this.currentSong);
                this.processId = setInterval(this.loop.bind(this), 5000);
            });
        }).catch(err => {
            console.log(err);
        });
    }

    loop(): void {
        // fs.copyFileSync('temp/latest.jpg', 'temp/latest_backup.jpg');
        extractLatestText(this.url).then(song => {
            if (!song) return;
            this.currentSong = song;
            extractLatestGif(this.url).then(hasSavedGif => {
                this.emit('change', this.currentSong);
            });
        }).catch(err => {
            console.log(err);
        });
    }

    end(): void {
        clearInterval(this.processId);
    }
}

async function main(): Promise<void> {
    const client = memjs.Client.create(MEMCACHIER_SERVERS, {
        username: MEMCACHIER_USERNAME,
        password: MEMCACHIER_PASSWORD
    });
    const url = (await checkValue(client, 'stream_url')).toString();
    const changeListener = new SongChangeListener(url);
    changeListener.init();

    changeListener.on('change', (current) => {
        client.set('current_song', current, { expires: 30 });
        client.set('latest.jpg', fs.readFileSync('temp/latest.jpg'), { expires: 30 });
        client.set('latest.gif', fs.readFileSync('temp/latest.gif'), { expires: 30 });
    });

    process.on('SIGINT', () => {
        changeListener.end();
        console.log('Exiting');
        process.exit(0);
    });

    process.on('uncaughtException', err => {
        console.log(err);
        changeListener.end();
        console.log('Exiting');
        process.exit(0);
    });

    process.on('unhandledRejection', err => {
        console.log(err);
        changeListener.end();
        console.log('Exiting');
        process.exit(0);
    });
}

main();
