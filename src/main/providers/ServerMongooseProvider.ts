import ***REMOVED*** Provider ***REMOVED*** from 'discord-akairo';
import ***REMOVED*** Model, Query ***REMOVED*** from 'mongoose';
import ***REMOVED*** ServerDocument ***REMOVED*** from '../models/ServerSchema';
import ***REMOVED*** traverseSet, traverseGet, traverseDelete ***REMOVED*** from '../util/traverse';

export default class ServerMongooseProvider extends Provider ***REMOVED***
    model: Model<ServerDocument>;

    constructor(model: Model<ServerDocument>) ***REMOVED***
        super();
        this.model = model;
    ***REMOVED***

    async init(): Promise<void> ***REMOVED***
        const guilds = await this.model.find();
        for (const i in guilds) ***REMOVED***
            const guild = guilds[i];
            this.items.set(guild.id, guild);
        ***REMOVED***
    ***REMOVED***

    get<T>(id: string, path: string, defaultValue: T): T ***REMOVED***
        if (this.items.has(id)) ***REMOVED***
            const value = traverseGet<T>(this.items.get(id), path.split('.'));
            return value == null ? defaultValue : value;
        ***REMOVED***

        return defaultValue;
    ***REMOVED***

    async set<T>(id: string, path: string, value: T): Promise<ServerDocument> ***REMOVED***
        const data = this.items.get(id) || ***REMOVED******REMOVED***;
        traverseSet<T>(data, path.split('.'), value);
        this.items.set(id, data);

        const doc = await this.getDocument(id);
        doc.set(path, value);
        doc.markModified(path);
        return doc.save();
    ***REMOVED***

    async delete(id: string, path: string): Promise<ServerDocument> ***REMOVED***
        const data = this.items.get(id) || ***REMOVED******REMOVED***;
        traverseDelete(data, path.split('.'));

        const doc = await this.getDocument(id);
        doc.set(path, null);
        doc.markModified(path);
        return doc.save();
    ***REMOVED***

    async clear(id: string): Promise<void> ***REMOVED***
        this.items.delete(id);
        const doc = await this.getDocument(id);
        if (doc) doc.remove();
    ***REMOVED***

    async getDocument(id: string): Promise<ServerDocument> ***REMOVED***
        const obj = await this.model.findOne(***REMOVED*** id ***REMOVED***);
        if (!obj) ***REMOVED***
            const newDoc = await new this.model(***REMOVED*** id ***REMOVED***).save();
            return newDoc;
        ***REMOVED***

        return obj;
    ***REMOVED***

    async getHighest(field: string, limit: number): Promise<ServerDocument[]> ***REMOVED***
        const filter = ***REMOVED******REMOVED***;
        filter[field] = -1;
        return await this.model.find().where('id').ne('me').sort(filter).limit(limit);
    ***REMOVED***
***REMOVED***
