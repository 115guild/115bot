const db = require("../database");
const config = require("../config");

module.exports = {
	name: '!register',
	description: 'Register!',
	execute(msg, args) {
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
	},
};
