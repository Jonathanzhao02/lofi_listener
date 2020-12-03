import ***REMOVED*** exec ***REMOVED*** from 'child_process';
import ***REMOVED*** exception ***REMOVED*** from 'console';
import ***REMOVED*** EventEmitter ***REMOVED*** from 'events';
import ***REMOVED*** URL ***REMOVED*** from 'url';

function extractSong(text: string): string ***REMOVED***
    const lines = text.split('\n');
    
    for (const line of lines) ***REMOVED***
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

function extractLatestFrame(url: string): Promise<boolean> ***REMOVED***
    return new Promise<boolean>((resolve) => ***REMOVED***
        exec(`ffmpeg -i $***REMOVED***url***REMOVED*** -hide_banner -loglevel fatal -vframes 1 -y latest.jpg`, (err, stdout, stderr) => ***REMOVED***
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
                exec('python tesseract-backend/main.py latest.jpg', (err, stdout, stderr) => ***REMOVED***
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
    private currentSong: string;
    private lastSong: string;
    private processId: ReturnType<typeof setTimeout>

    constructor(url: string) ***REMOVED***
        super();
        if (isValidUrl(url)) this.url = url;
        else throw exception('Invalid URL supplied to SongChangeListener!');
    ***REMOVED***

    init(): void ***REMOVED***
        extractLatestText(this.url).then(song => ***REMOVED***
            this.currentSong = song;
            this.lastSong = 'None';
            this.processId = setInterval(this.loop.bind(this), 5000);
        ***REMOVED***);
    ***REMOVED***

    loop(): void ***REMOVED***
        extractLatestText(this.url).then(song => ***REMOVED***
            if (song.valueOf() !== this.currentSong.valueOf()) ***REMOVED***
                this.lastSong = this.currentSong;
                this.currentSong = song;
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
***REMOVED***
