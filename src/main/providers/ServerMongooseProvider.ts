import { Provider } from 'discord-akairo';
import { Model } from 'mongoose';
import { ServerDocument } from '../models/ServerSchema';
import { traverseSet, traverseGet, traverseDelete } from '../util/traverse';

export default class ServerMongooseProvider extends Provider {
    model: Model<ServerDocument>;

    constructor(model: Model<ServerDocument>) {
        super();
        this.model = model;
    }

    async init(): Promise<void> {
        const guilds = await this.model.find();
        for (const i in guilds) {
            const guild = guilds[i];
            this.items.set(guild.id, guild);
        }
    }

    get<T>(id: string, path: string, defaultValue: T): T {
        if (this.items.has(id)) {
            const value = traverseGet<T>(this.items.get(id), path.split('.'));
            return value == null ? defaultValue : value;
        }

        return defaultValue;
    }

    async set<T>(id: string, path: string, value: T): Promise<ServerDocument> {
        const data = this.items.get(id) || {};
        traverseSet<T>(data, path.split('.'), value);
        this.items.set(id, data);

        const doc = await this.getDocument(id);
        doc.set(path, value);
        doc.markModified(path);
        return doc.save();
    }

    async delete(id: string, path: string): Promise<ServerDocument> {
        const data = this.items.get(id) || {};
        traverseDelete(data, path.split('.'));

        const doc = await this.getDocument(id);
        doc.set(path, null);
        doc.markModified(path);
        return doc.save();
    }

    async clear(id: string): Promise<void> {
        this.items.delete(id);
        const doc = await this.getDocument(id);
        if (doc) doc.remove();
    }

    async getDocument(id: string): Promise<ServerDocument> {
        const obj = await this.model.findOne({ id });
        if (!obj) {
            const newDoc = await new this.model({ id }).save();
            return newDoc;
        }

        return obj;
    }
}
