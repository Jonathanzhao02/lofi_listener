import { EventEmitter } from 'events';
import { URL } from 'url';
import * as https from 'https';
import * as fs from 'fs';
import * as ft from 'file-type';
import { getInfo, videoFormat } from 'ytdl-core';

const CHANGE_THRESHOLD = Number(process.env['CHANGE_THRESHOLD']);
const VID_QUALITY = process.env['VID_QUALITY'];
const STREAM_URL = process.env['STREAM_URL'];

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

function isValidUrl(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            new URL(url);

            https.get(url, res => {
                if (res.statusCode < 300 && res.statusCode >= 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });

        } catch (err) {
            resolve(false);
        }
    });
}

function getBestFormat(url: string): Promise<string> {
    return new Promise<string>(resolve => {
        getInfo(url).then(info => {
            let formats = info.formats;
            const filter = (format: videoFormat): boolean => format.audioBitrate && format.isHLS && format.qualityLabel === VID_QUALITY;
            formats = formats
                .filter(filter)
                .sort((a, b) => b.audioBitrate - a.audioBitrate);
            resolve((formats.find(format => !format.bitrate) || formats[0]).url);
        });
    });
}

export default class MemSongListener extends EventEmitter {
    private url: string;
    private processId: ReturnType<typeof setTimeout>
    private processId_2: ReturnType<typeof setTimeout>

    private currentSong: string;
    private lastSong: string;
    private songsPlayed: number;
    private client;

    constructor(client) {
        super();
        this.client = client;
    }

    async init(): Promise<void> {
        do {
            this.url = await getBestFormat(STREAM_URL);
        } while (!(await isValidUrl(this.url)));

        if (!fs.existsSync('temp')) fs.mkdirSync('temp');
        await this.client.set('stream_url', this.url, { expire: 30 });
        this.songsPlayed = 0;
        const song = await checkValue(this.client, 'current_song');
        if (song) this.currentSong = song.toString();
        let success = false;
        do {
            success = await fetchResources(this.client);
        } while (!success);
        this.processId = setInterval(this.loop.bind(this), 5000);
        this.processId_2 = setInterval(async () => {
            do {
                this.url = await getBestFormat(STREAM_URL);
            } while (!(await isValidUrl(this.url)));

            this.emit('url', this.url);
        }, 3600000 * 6);

        this.emit('url', this.url);
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
                console.log(this.currentSong);
                this.emit('change', this.currentSong, this.lastSong);
            }
        });
    }

    end(): void {
        clearInterval(this.processId);
        clearInterval(this.processId_2);
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
