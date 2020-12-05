import mongoose, ***REMOVED*** Document ***REMOVED*** from 'mongoose';
const ***REMOVED*** BOT_PREFIX ***REMOVED*** = require('../../config.json');
const Schema = mongoose.Schema;

const ServerSchema = new Schema(
    ***REMOVED***
        id: ***REMOVED***
            type: String,
            required: true
        ***REMOVED***,
        settings: ***REMOVED***
            prefix: ***REMOVED***
                type: String,
                minlength: 1,
                maxlength: 1,
                default: BOT_PREFIX
            ***REMOVED***,
            notificationsOn: ***REMOVED***
                type: Boolean,
                default: true
            ***REMOVED***,
            notificationChannel: ***REMOVED***
                type: String,
                default: ''
            ***REMOVED***
        ***REMOVED***,
        data: ***REMOVED***
            totalTime: ***REMOVED***
                type: Number,
                min: 0,
                default: 0
            ***REMOVED***,
            totalSongs: ***REMOVED***
                type: Number,
                min: 0,
                default: 0
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***,
    ***REMOVED***
        minimize: false
    ***REMOVED***
);

export interface ServerSettings ***REMOVED***
    prefix?: string,
    notificationsOn?: boolean,
    notificationChannel?: string
***REMOVED***

export interface ServerData ***REMOVED***
    totalTime?: number,
    totalSongs?: number
***REMOVED***

export interface ServerDocument extends Document ***REMOVED***
    id: string,
    settings: ServerSettings,
    data: ServerData
***REMOVED***

export default mongoose.model<ServerDocument>('server', ServerSchema);
