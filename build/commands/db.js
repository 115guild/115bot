"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const config_1 = __importDefault(require("../config"));
class default_1 {
    execute(msg, args) {
        if (msg.channel.id !== config_1.default.DB_CHANNEL_ID) {
            return;
        }
        if (!msg.member.roles.find(r => r.name === "Admin")) {
            msg.channel.send('The role \`Admin\` is required to run this command.');
            return;
        }
        if (args.length < 2) {
            msg.channel.send('Usage: \`!db [table] [ADD / REMOVE / UPDATE]\`');
            return;
        }
        switch (args[0]) {
            case 'users': {
                switch (args[1]) {
                    case 'ADD': {
                        if (args.length !== 4 || !msg.mentions.users.first()) {
                            msg.channel.send('Usage: \`!db users ADD @user [scoreSaberID]\`');
                            return;
                        }
                        const username = msg.mentions.users.first().tag;
                        const discordID = msg.mentions.users.first().id;
                        const scoreSaberID = args[3];
                        if (!database_1.default.isValidSSID(scoreSaberID)) {
                            msg.channel.send(database_1.default.invalidSSIDMessage);
                            return;
                        }
                        database_1.default.addUser(discordID, scoreSaberID, username, msg);
                        break;
                    }
                    case 'REMOVE': {
                        if (args.length !== 3) {
                            msg.channel.send('Usage: \`!db users REMOVE [discordID]\`');
                            return;
                        }
                        const discordID = args[2];
                        if (!database_1.default.isValidDID(discordID)) {
                            msg.channel.send(database_1.default.invalidDIDMessage);
                            return;
                        }
                        database_1.default.removeUser(discordID, msg);
                        break;
                    }
                    case 'UPDATE': {
                        if (args.length !== 4 || !msg.mentions.users.first()) {
                            msg.channel.send('Usage: \`!db users UPDATE @user [scoreSaberID]\`');
                            return;
                        }
                        const discordID = msg.mentions.users.first().id;
                        const username = msg.mentions.users.first().tag;
                        const scoreSaberID = args[3];
                        if (!database_1.default.isValidSSID(scoreSaberID)) {
                            msg.channel.send(database_1.default.invalidSSIDMessage);
                            return;
                        }
                        database_1.default.updateUser(discordID, scoreSaberID, username, msg);
                        break;
                    }
                }
                break;
            }
            case 'songs': {
                break;
            }
            default: {
                msg.channel.send(database_1.default.notImplementedTableMessage);
                msg.channel.send('Usage: \`!db [table] [ADD / REMOVE / UPDATE]\`');
            }
        }
    }
    ;
}
exports.default = default_1;
;
//# sourceMappingURL=db.js.map