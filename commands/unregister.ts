import { Message, NewsChannel, MessageCollector } from 'discord.js';
import db from '../database';
import config from '../config';
import Command from './Command';

export default class implements Command {
	name = '!unregister';
	description = 'Unregister!';
	execute(msg: Message) {
		if (msg.channel.id !== config.REGISTER_CHANNEL_ID) {
			return;
		}
        if (msg.channel.type === 'news') {
            console.error('Cannot use MessageCollector in a news channel');
            return;
        }
		msg.channel.send("Are you sure you want to unregister? (y/n)");
		const collector = new MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
		collector.on('collect', message => {
			if (message.content === "y" || message.content === "yes") {
				db.removeUser(msg.author.id, msg);
				return collector.stop();
			} else {
				message.channel.send("Cancelled unregistration.");
				return collector.stop();
			}
		});
	};
};
