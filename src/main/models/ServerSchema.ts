import mongoose, { Document } from 'mongoose';
import LofiClient from '../LofiClient';
const { BOT_PREFIX } = require('../../config.json');
const Schema = mongoose.Schema;

const ServerSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        settings: {
            prefix: {
                type: String,
                minlength: 1,
                maxlength: 1,
                default: BOT_PREFIX
            },
            notificationsOn: {
                type: Boolean,
                default: true
            },
            notificationChannel: {
                type: String,
                default: ''
            },
            useGifs: {
                type: Boolean,
                default: true
            }
        },
        data: {
            totalTime: {
                type: Number,
                min: 0,
                default: 0
            },
            totalSongs: {
                type: Number,
                min: 0,
                default: 0
            }
        }
    },
    {
        minimize: false
    }
);

export interface ServerSettings {
    prefix?: string,
    notificationsOn?: boolean,
    notificationChannel?: string,
    useGifs?: boolean
}

export interface ServerData {
    totalTime?: number,
    totalSongs?: number
}

export interface ServerDocument extends Document {
    id: string,
    settings: ServerSettings,
    data: ServerData
}

export default mongoose.model<ServerDocument>('server', ServerSchema);
