import { exec } from 'child_process';
import { exception } from 'console';
import { EventEmitter } from 'events';
import { URL } from 'url';

const BLACKLISTED = {
    '’': '\''
};

function extractSong(text: string): string {
    const lines = text.split('\n');
    
    for (let line of lines) {
        if (line.indexOf('-') > 0) {

            for (const char in BLACKLISTED) {
                line = line.replace(new RegExp(char, 'g'), BLACKLISTED[char]);
            }

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

function extractLatestFrame(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        exec(`ffmpeg -i ${url} -hide_banner -loglevel fatal -vframes 1 -y latest.jpg`, (err, stdout, stderr) => {
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
                exec('python tesseract-backend/main.py latest.jpg', (err, stdout, stderr) => {
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

export default class SongChangeListener extends EventEmitter {
    private url: string;
    private currentSong: string;
    private lastSong: string;
    private processId: ReturnType<typeof setTimeout>

    constructor(url: string) {
        super();
        if (isValidUrl(url)) this.url = url;
        else throw exception('Invalid URL supplied to SongChangeListener!');
    }

    init(): void {
        extractLatestText(this.url).then(song => {
            this.currentSong = song;
            this.lastSong = 'None';
            this.processId = setInterval(this.loop.bind(this), 5000);
        });
    }

    loop(): void {
        extractLatestText(this.url).then(song => {
            if (song.valueOf() !== this.currentSong.valueOf()) {
                this.lastSong = this.currentSong;
                this.currentSong = song;
                this.emit('change', this.currentSong, this.lastSong);
            }
        });
    }

    end(): void {
        clearInterval(this.processId);
    }

    getCurrentSong(): string {
        return this.currentSong;
    }

    getLastSong(): string {
        return this.lastSong;
    }
}
