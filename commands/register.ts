import db from '../database';
import config from '../config';
import { Message } from 'discord.js';
import Command from './Command';

export default class implements Command {
	name = '!register';
	description = 'Register!';
	execute(msg: Message, args: string[]) {
		if (msg.channel.id !== config.REGISTER_CHANNEL_ID) {
			return;
		}
		if (args.length < 1) {
			msg.channel.send('Please specify a ScoreSaber ID. Example: \`!register ID\`');
		} else {
			let id = args[0];

            // Test if argument is an ID
            if (db.isValidSSID(id)) {
                db.addUser(msg.author.id, id, msg.author.tag, msg);
                return;
            }
            // If not, see if argument is of form */u/ID*

            const startOfId = id.indexOf('/u/');
            if (startOfId !== -1)
                id = id.slice(startOfId + 3);
            else {
                msg.reply('Please use a valid scoresaber profile.');
                return;
            }

            let endOfId = id.indexOf('?');
            endOfId = endOfId < 0 ? id.indexOf('&') : endOfId;
            if (endOfId !== -1)
                id = id.slice(0, endOfId);

			if (!db.isValidSSID(id)) {
                msg.reply('Please use a valid scoresaber profile.');
			} else {
				db.addUser(msg.author.id, id, msg.author.tag, msg);
			}
		}
	};
};
