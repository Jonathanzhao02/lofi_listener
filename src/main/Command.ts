import { Message } from 'discord.js';
import DiscordClient from './DiscordClient';

type CommandHandler = (x: DiscordClient, y: Message, z: string[]) => void;

export default class Command {
    private handler: CommandHandler;
    private aliases: string[];

    constructor(aliases: string[], handler: CommandHandler) {
        this.handler = handler;
        this.aliases = aliases;
    }

    check(name: string): boolean {
        return this.aliases.includes(name);
    }

    run(client: DiscordClient, msg: Message, content: string[]): void {
        this.handler(client, msg, content);
    }
}
