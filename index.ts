import Discord from 'discord.js';
import config from './config';
import express from 'express';
import commands from './commands';

const app = express();
app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
app.listen(config.PORT);

const bot = new Discord.Client();
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
    console.info(`${msg.author.tag} called command: ${commandWord} ${args}`);
    const command = commands.find(c => c.name == commandWord);

    if (!command) {
        console.log('Command not found');
        return;
    }

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.channel.send('There was an error trying to execute that command!');
    }
});

function login(n: number) {
    if (n > 5) {
        console.error("EXITING DUE TO 5 FAILED LOGINS");
        process.exit(1);
    }
    bot.login(config.DISCORD_TOKEN).catch(err => {
        console.error(err);
        console.error("TRYING LOGIN AGAIN");
        login(n++);
    });
}
