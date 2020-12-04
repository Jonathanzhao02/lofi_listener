import { exec } from 'child_process';
import { exception } from 'console';
import { EventEmitter } from 'events';
import { URL } from 'url';
import * as fs from 'fs';

const { CHANGE_THRESHOLD } = require('../config.json');

function compareLevenshtein(a: string, b: string): number{
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 

    let matrix = [];

    for(let i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }

    for(let j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }

    for(let i = 1; i <= b.length; i++){
        for(let j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                               Math.min(matrix[i][j-1] + 1, // insertion
                               matrix[i-1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}

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
        exec(`ffmpeg -i ${url} -hide_banner -loglevel fatal -vframes 30 -vf fps=15,select='not(mod(n\\,3))' -y resources/latest.gif`, (err, stdout, stderr) => {
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
        exec(`ffmpeg -i ${url} -hide_banner -loglevel fatal -vframes 1 -y resources/latest.jpg`, (err, stdout, stderr) => {
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
                exec('python tesseract-backend/main.py resources/latest.jpg', (err, stdout, stderr) => {
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
    private processId: ReturnType<typeof setTimeout>

    private currentSong: string;
    private lastSong: string;
    private songsPlayed: number;

    constructor(url: string) {
        super();
        if (isValidUrl(url)) this.url = url;
        else throw exception('Invalid URL supplied to SongChangeListener!');
    }

    init(): void {
        extractLatestText(this.url).then(song => {
            this.currentSong = song;
            this.lastSong = 'None';
            this.songsPlayed = 0;
            extractLatestGif(this.url);
            this.processId = setInterval(this.loop.bind(this), 5000);
        });
    }

    loop(): void {
        fs.copyFileSync('resources/latest.jpg', 'resources/latest_backup.jpg');
        extractLatestText(this.url).then(song => {
            if (song?.valueOf() !== this.currentSong.valueOf() && compareLevenshtein(song, this.currentSong) > CHANGE_THRESHOLD) {
                this.lastSong = this.currentSong;
                this.currentSong = song;
                this.songsPlayed++;
                fs.copyFileSync('resources/latest.gif', 'resources/latest_old.gif');
                fs.copyFileSync('resources/latest_backup.jpg', 'resources/latest_old.jpg');
                extractLatestGif(this.url).then(hasSavedGif => {
                    this.emit('change', this.currentSong, this.lastSong);
                });
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

    getSongsPlayed(): number {
        return this.songsPlayed;
    }
}
