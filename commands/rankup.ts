import db from '../database';
import axios from 'axios';
import config from '../config';
import { Message } from 'discord.js';
import Command from './Command';

async function setRoles(msg: Message, scoreSaberID: string) {
    if (!scoreSaberID) {
        msg.channel.send(`You have not yet registered, please register with \`!register ScoreSaberID\` at ${msg.guild.channels.cache.get(config.REGISTER_CHANNEL_ID).toString()}`);
        return;
    }
    if (msg.member.roles.cache.get(config.ROLES[config.ROLES.length - 1][1])) {
        msg.channel.send(`You have already obtained the highest rank possible, stop flexing`);
        return;
    }
    let needsRole = true;
    for (const [role, roleID, hash] of config.ROLES) {
        if (msg.member.roles.cache.get(roleID)) {
            needsRole = false;
            break;
        }
    }
    if (needsRole) {
      await msg.member.roles.add(config.ROLES[0][1]).catch(console.error);
    }
    let previousID = null;
    let haveGivenRole = false;
    let getNext = false;
    for (const [role, roleID, hash] of config.ROLES) {
        if (getNext) {
            console.log(scoreSaberID);
            const data = await axios.get(`https://bsaber.com/campaign-api/leaderboard?challengeHash=${hash}&id=${scoreSaberID}`).then((response) => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return null;
                }
            }).catch(console.error);
            console.log(data);
            if (data && data.you && data.you.position) {
                await msg.member.roles.add(roleID).then(() => {
                    msg.channel.send(`Congratulations on beating the ${role} Milestone, you have earned the <@&${roleID}> role!`);
                    msg.member.roles.remove(previousID).catch(console.error);
                    previousID = roleID;
                    haveGivenRole = true;
                }).catch(console.error);
            } else if (data && data.you) {
                if (!haveGivenRole) {
                    msg.channel.send(`You need to beat the ${role} Milestone in order to rank up! If you have beaten it already make sure your score gets submitted to the leaderboard.`);
                }
                getNext = false;
            } else {
                msg.channel.send('Connection to the campaign API timed out, please try again. If it still doesn\'t work, please post a screenshot of the completed milestone showing your score on the leaderboard and tag the moderators.');
                getNext = false;
            }
        }
        if (msg.member.roles.cache.get(roleID)) {
            getNext = true;
            previousID = roleID;
        }
    }
}

export default class implements Command {
    name = '!rankup';
    description = 'Rankup!';
    async execute(msg: Message) {
        if (msg.channel.id !== config.RANKUP_CHANNEL_ID) {
            return;
        }
        db.getScoreSaberID(msg.member.id, msg, setRoles);
    };
};
