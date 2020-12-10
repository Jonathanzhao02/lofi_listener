import memjs from 'memjs';
import ***REMOVED*** exec ***REMOVED*** from 'child_process';
import ***REMOVED*** EventEmitter ***REMOVED*** from 'events';
import ***REMOVED*** URL ***REMOVED*** from 'url';
import * as fs from 'fs';

// for gifs/jpgs, can use fs.readFileSync() and fs.writeFileSync() to serialize and deserialize

const ***REMOVED*** MEMCACHIER_USERNAME, MEMCACHIER_PASSWORD, MEMCACHIER_SERVERS ***REMOVED*** = require('../../config.json');

function extractSong(text: string): string ***REMOVED***
    const lines = text.split('\n');
    
    for (let line of lines) ***REMOVED***
        if (line.indexOf('-') > 0) ***REMOVED***
            return line.trim();
        ***REMOVED***
    ***REMOVED***
***REMOVED***

function isValidUrl(url: string): boolean ***REMOVED***
    try ***REMOVED***
        new URL(url);
        return true;
    ***REMOVED*** catch (err) ***REMOVED***
        return false;
    ***REMOVED***
***REMOVED***

function extractLatestGif(url: string): Promise<boolean> ***REMOVED***
    return new Promise<boolean>((resolve) => ***REMOVED***
        exec(`ffmpeg -i $***REMOVED***url***REMOVED*** -hide_banner -loglevel fatal -vframes 30 -vf fps=15,scale=960:-1,select='not(mod(n\\,3))' -y resources/latest.gif`, (err, stdout, stderr) => ***REMOVED***
            if (err || stderr) ***REMOVED***
                console.log(`err: $***REMOVED***err ? err : stderr***REMOVED***`);
                resolve(false);
            ***REMOVED*** else ***REMOVED***
                resolve(true);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

function extractLatestFrame(url: string): Promise<boolean> ***REMOVED***
    return new Promise<boolean>((resolve) => ***REMOVED***
        exec(`ffmpeg -i $***REMOVED***url***REMOVED*** -hide_banner -loglevel fatal -vframes 1 -y resources/latest.jpg`, (err, stdout, stderr) => ***REMOVED***
            if (err || stderr) ***REMOVED***
                console.log(`err: $***REMOVED***err ? err : stderr***REMOVED***`);
                resolve(false);
            ***REMOVED*** else ***REMOVED***
                resolve(true);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

function extractLatestText(url: string): Promise<string> ***REMOVED***
    return new Promise<string>((resolve, reject) => ***REMOVED***
        extractLatestFrame(url).then(hasNewestFrame => ***REMOVED***
            if (hasNewestFrame) ***REMOVED***
                exec('python tesseract-backend/main.py resources/latest.jpg', (err, stdout, stderr) => ***REMOVED***
                    if (err || stderr) ***REMOVED***
                        console.log(`err: $***REMOVED***err ? err : stderr***REMOVED***`);
                        reject('Failed to run tesseract');
                    ***REMOVED*** else ***REMOVED***
                        resolve(extractSong(stdout));
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED*** else ***REMOVED***
                reject('Could not extract frame');
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

function checkValue(client, name: string, timeout = 10000, interval = 100): Promise<Buffer> ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        const startTime = Date.now();
        const check = function(val: ***REMOVED*** value: Buffer, flags: Buffer ***REMOVED***) ***REMOVED***
            if (val?.value) ***REMOVED***
                resolve(val.value);
            ***REMOVED*** else ***REMOVED***
                if (Date.now() - startTime > timeout) reject('Timed out');
                else setTimeout(() => client.get(name).then(check), interval);
            ***REMOVED***
        ***REMOVED***;

        client.get(name).then(check);
    ***REMOVED***);
***REMOVED***

export default class SongChangeListener extends EventEmitter ***REMOVED***
    private url: string;
    private processId: ReturnType<typeof setTimeout>

    private currentSong: string;

    constructor(url: string) ***REMOVED***
        super();
        if (isValidUrl(url)) this.url = url;
        else throw Error('Invalid URL supplied to SongChangeListener!');
    ***REMOVED***

    init(): void ***REMOVED***
        if (!fs.existsSync('resources')) fs.mkdirSync('resources');
        extractLatestText(this.url).then(song => ***REMOVED***
            this.currentSong = song;
            extractLatestGif(this.url).then(hasSavedGif => ***REMOVED***
                this.emit('change', this.currentSong);
                this.processId = setInterval(this.loop.bind(this), 5000);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***

    loop(): void ***REMOVED***
        fs.copyFileSync('resources/latest.jpg', 'resources/latest_backup.jpg');
        extractLatestText(this.url).then(song => ***REMOVED***
            if (!song) return;
            this.currentSong = song;
            extractLatestGif(this.url).then(hasSavedGif => ***REMOVED***
                this.emit('change', this.currentSong);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***

    end(): void ***REMOVED***
        clearInterval(this.processId);
    ***REMOVED***
***REMOVED***

async function main(): Promise<void> ***REMOVED***
    const client = memjs.Client.create(MEMCACHIER_SERVERS, ***REMOVED***
        username: MEMCACHIER_USERNAME,
        password: MEMCACHIER_PASSWORD
    ***REMOVED***);
    const url = (await checkValue(client, 'stream_url')).toString();
    const changeListener = new SongChangeListener(url);
    changeListener.init();

    changeListener.on('change', (current) => ***REMOVED***
        client.set('current_song', current, ***REMOVED*** expires: 10 ***REMOVED***);
        client.set('latest.jpg', fs.readFileSync('resources/latest.jpg'), ***REMOVED*** expires: 10 ***REMOVED***);
        client.set('latest.gif', fs.readFileSync('resources/latest.gif'), ***REMOVED*** expires: 10 ***REMOVED***);
    ***REMOVED***);

    process.on('SIGINT', () => ***REMOVED***
        changeListener.end();
        console.log('Exiting');
        process.exit(0);
    ***REMOVED***);

    process.on('uncaughtException', err => ***REMOVED***
        console.log(err);
        changeListener.end();
        console.log('Exiting');
        process.exit(0);
    ***REMOVED***);

    process.on('unhandledRejection', err => ***REMOVED***
        console.log(err);
        changeListener.end();
        console.log('Exiting');
        process.exit(0);
    ***REMOVED***);
***REMOVED***

main();
