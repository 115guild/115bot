const Discord = require('discord.js');
const config = require("./config");
const bot = new Discord.Client();
const express = require('express');
const botCommands = require('./commands');

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(config.PORT);

bot.commands = new Discord.Collection();

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

login(0);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content.charAt(0) !== '!') {
        return;
    }
    const args = msg.content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Called command: ${command} ${args}`);

    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.channel.send('There was an error trying to execute that command!');
    }
});

function login(n) {
  if (n > 5) {
    console.error("EXITING DUE TO 5 FAILED LOGINS");
    process.exit(1);
  }
  bot.login(config.DISCORD_TOKEN).catch(function(err) {
    console.error(err);
    console.error("TRYING LOGIN AGAIN");
    login(n+1);
  });
}
