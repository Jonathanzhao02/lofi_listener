import ***REMOVED*** Message ***REMOVED*** from 'discord.js';
import DiscordClient from './DiscordClient';

type CommandHandler = (x: DiscordClient, y: Message, z: string[]) => void;

export default class Command ***REMOVED***
    private handler: CommandHandler;
    private aliases: string[];

    constructor(aliases: string[], handler: CommandHandler) ***REMOVED***
        this.handler = handler;
        this.aliases = aliases;
    ***REMOVED***

    check(name: string): boolean ***REMOVED***
        return this.aliases.includes(name);
    ***REMOVED***

    run(client: DiscordClient, msg: Message, content: string[]): void ***REMOVED***
        this.handler(client, msg, content);
    ***REMOVED***
***REMOVED***
