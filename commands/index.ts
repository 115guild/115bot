import Command from './Command';
import db from './db';
import rankup from './rankup';
import register from './register';
import unregister from './unregister';

class Commands {
    static commands: Command[] = [
        new db(),
        new rankup(),
        new register(),
        new unregister()
    ]
}

export default Commands.commands;