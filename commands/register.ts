import db from '../database';
import config from '../config';
import { Message } from 'discord.js';
import Command from './Command';

export default class implements Command {
	name: '!register';
	description: 'Register!';
	execute(msg: Message, args: string[]) {
		if (msg.channel.id !== config.REGISTER_CHANNEL_ID) {
			return;
		}
		if (args.length < 1) {
			msg.channel.send('Please specify a ScoreSaber ID. Example: \`!register ID\`');
		} else {
			let id = args[0];
			if (id && id.length > 26) {
				id = id.substring(25)
			}
			//if (!db.isValidSSID(id)) {
			//	msg.channel.send(db.invalidSSIDMessage);
			//} else {
				db.addUser(msg.author.id, id, msg.author.tag, msg);
			//}
		}
	};
};
