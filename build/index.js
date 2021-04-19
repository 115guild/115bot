"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const commands_1 = __importDefault(require("./commands"));
const app = express_1.default();
app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
app.listen(config_1.default.PORT);
const bot = new discord_js_1.default.Client();
login(0);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});
bot.on('message', msg => {
    if (msg.content.charAt(0) !== '!') {
        return;
    }
    const args = msg.content.split(/ +/);
    const commandWord = args.shift().toLowerCase();
    console.info(`Called command: ${commandWord} ${args}`);
    const command = commands_1.default.find(c => c.name === commandWord);
    if (!command)
        return;
    try {
        command.execute(msg, args);
    }
    catch (error) {
        console.error(error);
        msg.channel.send('There was an error trying to execute that command!');
    }
});
function login(n) {
    if (n > 5) {
        console.error("EXITING DUE TO 5 FAILED LOGINS");
        process.exit(1);
    }
    bot.login(config_1.default.DISCORD_TOKEN).catch(function (err) {
        console.error(err);
        console.error("TRYING LOGIN AGAIN");
        login(n + 1);
    });
}
//# sourceMappingURL=index.js.map