import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as ft from 'file-type';

const CHANGE_THRESHOLD = Number(process.env['CHANGE_THRESHOLD']);

function compareLevenshtein(a: string, b: string): number {
    if (!a || !b) return a?.length || b?.length;

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

function checkValue(client, name: string, timeout = 10000, interval = 100): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = function(val: { value: Buffer, flags: Buffer }) {
            if (val?.value) {
                resolve(val.value);
            } else {
                if (Date.now() - startTime > timeout) resolve(null);
                else setTimeout(() => client.get(name).then(check), interval);
            }
        };

        client.get(name).then(check);
    });
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

async function fetchResources(client): Promise<boolean> {
    const gifBuffer = await checkValue(client, 'latest.gif');
    const jpgBuffer = await checkValue(client, 'latest.jpg');
    if (gifBuffer && jpgBuffer) {
        if (fs.existsSync('temp/latest.gif')) fs.copyFileSync('temp/latest.gif', 'temp/latest_old.gif');
        if (fs.existsSync('temp/latest.jpg')) fs.copyFileSync('temp/latest.jpg', 'temp/latest_old.jpg');
        const gifBuffType = await ft.fromBuffer(gifBuffer);
        const jpgBuffType = await ft.fromBuffer(jpgBuffer);
        if (gifBuffType?.ext === 'gif') fs.writeFileSync('temp/latest.gif', gifBuffer);
        if (jpgBuffType?.ext === 'jpg') fs.writeFileSync('temp/latest.jpg', jpgBuffer);
        return gifBuffType?.ext === 'gif' && jpgBuffType?.ext === 'jpg';
    }

    return false;
}

export default class MemSongListener extends EventEmitter {
    private url: string;
    private processId: ReturnType<typeof setTimeout>

    private currentSong: string;
    private lastSong: string;
    private songsPlayed: number;
    private client;

    constructor(client, url: string) {
        super();
        if (isValidUrl(url)) this.url = url;
        else throw Error('Invalid URL supplied to MemSongListener!');
        this.client = client;
    }

    init(): void {
        if (!fs.existsSync('temp')) fs.mkdirSync('temp');
        this.client.set('stream_url', this.url, { expire: 30 }).then(() => {
            this.songsPlayed = 0;
            checkValue(this.client, 'current_song').then(async song => {
                if (song) this.currentSong = song.toString();
                let success = false;
                do {
                    success = await fetchResources(this.client);
                } while (!success);
                this.processId = setInterval(this.loop.bind(this), 5000);
            });
        });
    }

    loop(): void {
        this.client.set('stream_url', this.url, { expire: 30 });
        checkValue(this.client, 'current_song').then(async song => {
            if (song && compareLevenshtein(song.toString(), this.currentSong) > CHANGE_THRESHOLD && compareLevenshtein(song.toString(), this.lastSong) > CHANGE_THRESHOLD) {
                this.lastSong = this.currentSong;
                this.currentSong = song.toString();
                this.songsPlayed++;
                let success = false;
                do {
                    success = await fetchResources(this.client);
                } while (!success);
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

    getSongsPlayed(): number {
        return this.songsPlayed;
    }
}
