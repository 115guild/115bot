"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config"));
//sequelize = new Sequelize(config.DATABASE_URL);
const sequelize = new sequelize_1.Sequelize(config_1.default.DATABASE_URL, { logging: false,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
        },
    }
});
const Users = sequelize.define('users', {
    discordID: {
        primaryKey: true,
        type: sequelize_1.DataTypes.STRING
    },
    scoreSaberID: {
        unique: true,
        type: sequelize_1.DataTypes.STRING
    },
    username: {
        type: sequelize_1.DataTypes.STRING
    }
}, { timestamps: false });
sequelize.sync();
class Database {
    static addUser(discordID, scoreSaberID, username, msg) {
        Users.findOrCreate({
            where: { discordID: discordID },
            defaults: { scoreSaberID: scoreSaberID, username: username }
        }).then(function ([user, created]) {
            if (created) {
                msg.channel.send(`Successfully registered \`${username}\` with ScoreSaber ID \`${scoreSaberID}\``);
                var needsRole = true;
                for (const [role, roleID, hash] of config_1.default.ROLES) {
                    if (msg.member.roles.get(roleID)) {
                        needsRole = false;
                        break;
                    }
                }
                if (needsRole) {
                    msg.member.addRole(config_1.default.ROLES[0][1]).catch(console.error);
                }
            }
            else {
                msg.channel.send(`\`${username}\` is already registered, use \`!unregister\` to be able to register with a new id`);
            }
        }).catch(error => {
            if (Array.isArray(error.fields) && error.fields[0] === 'scoreSaberID') {
                Users.findOne({ where: { scoreSaberID: scoreSaberID } }).then(function (user) {
                    msg.channel.send(`The ScoreSaber ID \`${scoreSaberID}\` is already used by \`${user.username}\` \`[${user.discordID}]\``);
                }).catch(console.error);
            }
            console.error(error);
        });
    }
    static removeUser(discordID, msg) {
        Users.findOne({ where: { discordID: discordID } }).then(user => {
            if (user) {
                user.destroy().then(() => {
                    msg.channel.send(`Successfully unregistered \`${user.username}\` \`[${discordID}]\``);
                }).catch(console.error);
            }
            else {
                msg.channel.send('That user is not registered in the database');
            }
        }).catch(console.error);
    }
    static getScoreSaberID(discordID, msg, callback) {
        Users.findOne({ where: { discordID: discordID } }).then(user => {
            if (user) {
                callback(msg, user.scoreSaberID);
            }
            else {
                callback(msg, null);
            }
        }).catch(console.error);
    }
    static updateUser(discordID, scoreSaberID, username, msg) {
        Users.findOne({ where: { discordID: discordID } }).then(user => {
            if (user) {
                user.scoreSaberID = scoreSaberID;
                user.username = username;
                msg.channel.send(`Successfully updated record for \`${user}\` \`[${discordID}]\``);
            }
            else {
                msg.channel.send('That user is not registered in the database');
            }
        }).catch(console.error);
    }
    // Returns true if the ScoreSaber ID is valid.
    static isValidSSID(SSID) {
        return !(isNaN(parseInt(SSID)) || SSID.length < 15 || SSID.length > 17);
    }
    ;
    // Returns true if the Discord ID is a number.
    static isValidDID(DID) {
        return !(isNaN(parseInt(DID)));
    }
}
exports.default = Database;
// Database ERROR messages
Database.invalidSSIDMessage = 'That is not a valid ID. The ScoreSaber ID should be a number with 15, 16, or 17 digits' +
    ' and can be found at the end of the url on your ScoreSaber profile: \`https://scoresaber.com/u/<ID>\`';
Database.invalidDIDMessage = 'That is not a valid Discord ID.';
Database.notImplementedTableMessage = 'That is not a valid table, currently implemented tables: [users / songs]';
//# sourceMappingURL=database.js.map