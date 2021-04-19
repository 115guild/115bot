"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const database_1 = __importDefault(require("../database"));
const config_1 = __importDefault(require("../config"));
class default_1 {
    execute(msg) {
        if (msg.channel.id !== config_1.default.REGISTER_CHANNEL_ID) {
            return;
        }
        msg.channel.send("Are you sure you want to unregister? (y/n)");
        const collector = new discord_js_1.default.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
        collector.on('collect', message => {
            if (message.content === "y" || message.content === "yes") {
                database_1.default.removeUser(msg.author.id, msg);
                return collector.stop();
            }
            else {
                message.channel.send("Cancelled unregistration.");
                return collector.stop();
            }
        });
    }
    ;
}
exports.default = default_1;
;
//# sourceMappingURL=unregister.js.map