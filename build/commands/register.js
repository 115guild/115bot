"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const config_1 = __importDefault(require("../config"));
class default_1 {
    execute(msg, args) {
        if (msg.channel.id !== config_1.default.REGISTER_CHANNEL_ID) {
            return;
        }
        if (args.length < 1) {
            msg.channel.send('Please specify a ScoreSaber ID. Example: \`!register ID\`');
        }
        else {
            let id = args[0];
            if (id && id.length > 26) {
                id = id.substring(25);
            }
            //if (!db.isValidSSID(id)) {
            //	msg.channel.send(db.invalidSSIDMessage);
            //} else {
            database_1.default.addUser(msg.author.id, id, msg.author.tag, msg);
            //}
        }
    }
    ;
}
exports.default = default_1;
;
//# sourceMappingURL=register.js.map