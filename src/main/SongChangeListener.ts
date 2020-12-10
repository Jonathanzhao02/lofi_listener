import ***REMOVED*** exec ***REMOVED*** from 'child_process';
import ***REMOVED*** exception ***REMOVED*** from 'console';
import ***REMOVED*** EventEmitter ***REMOVED*** from 'events';
import ***REMOVED*** URL ***REMOVED*** from 'url';
import * as fs from 'fs';

const ***REMOVED*** CHANGE_THRESHOLD ***REMOVED*** = require('../config.json');

function compareLevenshtein(a: string, b: string): number ***REMOVED***
    if (!a || !b) return a?.length || b?.length;
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 

    let matrix = [];

    for(let i = 0; i <= b.length; i++)***REMOVED***
        matrix[i] = [i];
    ***REMOVED***

    for(let j = 0; j <= a.length; j++)***REMOVED***
        matrix[0][j] = j;
    ***REMOVED***

    for(let i = 1; i <= b.length; i++)***REMOVED***
        for(let j = 1; j <= a.length; j++)***REMOVED***
            if(b.charAt(i-1) == a.charAt(j-1))***REMOVED***
                matrix[i][j] = matrix[i-1][j-1];
            ***REMOVED*** else ***REMOVED***
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                               Math.min(matrix[i][j-1] + 1, // insertion
                               matrix[i-1][j] + 1)); // deletion
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    return matrix[b.length][a.length];
***REMOVED***

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
        if (!fs.existsSync('resources')) fs.mkdirSync('resources');
        extractLatestText(this.url).then(song => ***REMOVED***
            this.currentSong = song;
            this.songsPlayed = 0;
            extractLatestGif(this.url);
            this.processId = setInterval(this.loop.bind(this), 5000);
        ***REMOVED***);
    ***REMOVED***

    loop(): void ***REMOVED***
        fs.copyFileSync('resources/latest.jpg', 'resources/latest_backup.jpg');
        extractLatestText(this.url).then(song => ***REMOVED***
            if (song?.valueOf() !== this.currentSong?.valueOf() && compareLevenshtein(song, this.currentSong) > CHANGE_THRESHOLD) ***REMOVED***
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
