import ***REMOVED*** exec ***REMOVED*** from 'child_process';
import ***REMOVED*** exception ***REMOVED*** from 'console';
import ***REMOVED*** EventEmitter ***REMOVED*** from 'events';
import ***REMOVED*** URL ***REMOVED*** from 'url';
import * as fs from 'fs';

const BLACKLISTED = ***REMOVED***
    '’': '\''
***REMOVED***;

function compare(x: string, y: string): number ***REMOVED***
    if (x.length > y.length) ***REMOVED***
        const temp = x;
        x = y;
        y = temp;
    ***REMOVED***

    let diff = y.length - x.length;

    for (let i = 0; i < x.length; i++) ***REMOVED***
        if (x.charAt(i) !== y.charAt(i)) diff++;
    ***REMOVED***

    return diff;
***REMOVED***

function extractSong(text: string): string ***REMOVED***
    const lines = text.split('\n');
    
    for (let line of lines) ***REMOVED***
        if (line.indexOf('-') > 0) ***REMOVED***

            for (const char in BLACKLISTED) ***REMOVED***
                line = line.replace(new RegExp(char, 'g'), BLACKLISTED[char]);
            ***REMOVED***

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
        exec(`ffmpeg -i $***REMOVED***url***REMOVED*** -hide_banner -loglevel fatal -vframes 30 -vf fps=15,select='not(mod(n\\,3))' -y resources/latest.gif`, (err, stdout, stderr) => ***REMOVED***
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
        fs.copyFileSync('resources/latest.jpg', 'resources/latest_backup.jpg');
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

export default class SongChangeListener extends EventEmitter ***REMOVED***
    private url: string;
    private processId: ReturnType<typeof setTimeout>

    private currentSong: string;
    private lastSong: string;
    private songsPlayed: number;

    constructor(url: string) ***REMOVED***
        super();
        if (isValidUrl(url)) this.url = url;
        else throw exception('Invalid URL supplied to SongChangeListener!');
    ***REMOVED***

    init(): void ***REMOVED***
        extractLatestText(this.url).then(song => ***REMOVED***
            this.currentSong = song;
            this.lastSong = 'None';
            this.songsPlayed = 0;
            extractLatestGif(this.url);
            this.processId = setInterval(this.loop.bind(this), 5000);
        ***REMOVED***);
    ***REMOVED***

    loop(): void ***REMOVED***
        extractLatestText(this.url).then(song => ***REMOVED***
            if (song?.valueOf() !== this.currentSong.valueOf() && compare(song, this.currentSong) > 3) ***REMOVED***
                this.lastSong = this.currentSong;
                this.currentSong = song;
                this.songsPlayed++;
                fs.copyFileSync('resources/latest.gif', 'resources/latest_old.gif');
                fs.copyFileSync('resources/latest_backup.jpg', 'resources/latest_old.jpg');
                extractLatestGif(this.url).then(hasSavedGif => ***REMOVED***
                    this.emit('change', this.currentSong, this.lastSong);
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

    end(): void ***REMOVED***
        clearInterval(this.processId);
    ***REMOVED***

    getCurrentSong(): string ***REMOVED***
        return this.currentSong;
    ***REMOVED***

    getLastSong(): string ***REMOVED***
        return this.lastSong;
    ***REMOVED***

    getSongsPlayed(): number ***REMOVED***
        return this.songsPlayed;
    ***REMOVED***
***REMOVED***
