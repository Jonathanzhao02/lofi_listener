import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec(): void {
        console.log('Bot logged in');
    }
}
