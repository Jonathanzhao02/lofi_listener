import ***REMOVED*** EventEmitter ***REMOVED*** from 'events';
import * as fs from 'fs';

const ***REMOVED*** CHANGE_THRESHOLD ***REMOVED*** = require('../../config.json');

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

function isValidUrl(url: string): boolean ***REMOVED***
    try ***REMOVED***
        new URL(url);
        return true;
    ***REMOVED*** catch (err) ***REMOVED***
        return false;
    ***REMOVED***
***REMOVED***

export default class MemSongListener extends EventEmitter ***REMOVED***
    private url: string;
    private processId: ReturnType<typeof setTimeout>

    private currentSong: string;
    private lastSong: string;
    private songsPlayed: number;
    private client;

    constructor(client, url: string) ***REMOVED***
        super();
        if (isValidUrl(url)) this.url = url;
        else throw Error('Invalid URL supplied to MemSongListener!');
        this.client = client;
    ***REMOVED***

    init(): void ***REMOVED***
        this.client.set('stream_url', this.url, ***REMOVED*** expire: 30 ***REMOVED***).then(() => ***REMOVED***
            this.songsPlayed = 0;
            checkValue(this.client, 'current_song').then(song => ***REMOVED***
                this.currentSong = song.toString();
                this.processId = setInterval(this.loop.bind(this), 5000);
            ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***

    loop(): void ***REMOVED***
        checkValue(this.client, 'current_song').then(song => ***REMOVED***
            if (compareLevenshtein(song.toString(), this.currentSong) > CHANGE_THRESHOLD) ***REMOVED***
                this.lastSong = this.currentSong;
                this.currentSong = song.toString();
                this.songsPlayed++;
                fs.copyFileSync('resources/latest.gif', 'resources/latest_old.gif');
                fs.copyFileSync('resources/latest_backup.jpg', 'resources/latest_old.jpg');
                this.emit('change', this.currentSong, this.lastSong);
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
