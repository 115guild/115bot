"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
async function setRoles(msg, scoreSaberID) {
    if (!scoreSaberID) {
        msg.channel.send(`You have not yet registered, please register with \`!register ScoreSaberID\` at ${msg.guild.channels.get(config_1.default.REGISTER_CHANNEL_ID).toString()}`);
        return;
    }
    if (msg.member.roles.get(config_1.default.ROLES[config_1.default.ROLES.length - 1][1])) {
        msg.channel.send(`You have already obtained the highest rank possible, stop flexing`);
        return;
    }
    let getNext = false;
    let needsRole = true;
    for (const [role, roleID, hash] of config_1.default.ROLES) {
        if (msg.member.roles.get(roleID)) {
            needsRole = false;
            break;
        }
    }
    if (needsRole) {
        await msg.member.addRole(config_1.default.ROLES[0][1]).catch(console.error);
    }
    let previousID = null;
    let haveGivenRole = false;
    for (const [role, roleID, hash] of config_1.default.ROLES) {
        if (getNext) {
            console.log(scoreSaberID);
            const data = await axios_1.default.get(`https://bsaber.com/campaign-api/leaderboard?challengeHash=${hash}&id=${scoreSaberID}`).then((response) => {
                if (response && response.data) {
                    return response.data;
                }
                else {
                    return null;
                }
            }).catch(console.error);
            console.log(data);
            if (data && data.you && data.you.position) {
                await msg.member.addRole(roleID).then((response) => {
                    msg.channel.send(`Congratulations on beating the ${role} Milestone, you have earned the <@&${roleID}> role!`);
                    msg.member.removeRole(previousID).catch(console.error);
                    previousID = roleID;
                    haveGivenRole = true;
                }).catch(console.error);
            }
            else if (data && data.you) {
                if (!haveGivenRole) {
                    msg.channel.send(`You need to beat the ${role} Milestone in order to rank up! If you have beaten it already make sure your score gets submitted to the leaderboard.`);
                }
                getNext = false;
            }
            else {
                msg.channel.send('Connection to campaign api timed out, please try again');
                getNext = false;
            }
        }
        if (msg.member.roles.get(roleID)) {
            getNext = true;
            previousID = roleID;
        }
    }
}
class default_1 {
    async execute(msg) {
        if (msg.channel.id !== config_1.default.RANKUP_CHANNEL_ID) {
            return;
        }
        database_1.default.getScoreSaberID(msg.member.id, msg, setRoles);
    }
    ;
}
exports.default = default_1;
;
//# sourceMappingURL=rankup.js.map