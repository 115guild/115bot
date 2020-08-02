const Discord = require('discord.js');
const db = require("../database");
const config = require("../config");

module.exports = {
	name: '!unregister',
	description: 'Unregister!',
	execute(msg, args) {
		if (msg.channel.id !== config.REGISTER_CHANNEL_ID) {
			return;
		}
		msg.channel.send("Are you sure you want to unregister? (y/n)");
		const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
		collector.on('collect', message => {
			if (message.content === "y" || message.content === "yes") {
				db.removeUser(msg.author.id, msg);
				return collector.stop();
			} else {
				message.channel.send("Cancelled unregistration.");
				return collector.stop();
			}
		});
	},
};
