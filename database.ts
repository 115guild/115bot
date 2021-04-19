import { Message } from 'discord.js';
import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import config from './config';

//sequelize = new Sequelize(config.DATABASE_URL);
const sequelize = new Sequelize(config.DATABASE_URL,
    {   logging: false,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                // Ref.: https://github.com/brianc/node-postgres/issues/2009
                rejectUnauthorized: false,
              },
        }
    }
);

interface UserAttributes {
    discordID: string,
    scoreSaberID: string,
    username: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'discordID'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const Users = sequelize.define<UserInstance>('users', {
  discordID: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  scoreSaberID: {
    unique: true,
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING
  }
},{timestamps: false});

sequelize.sync();

export default class Database {
    static addUser(discordID: string, scoreSaberID: string, username: string, msg: Message) {
        Users.findOrCreate({
            where: {discordID: discordID}, 
            defaults: {scoreSaberID: scoreSaberID, username: username}
        }).then(function([user,created]) {
            if (created) {
            msg.channel.send(`Successfully registered \`${username}\` with ScoreSaber ID \`${scoreSaberID}\``);
            var needsRole = true;
            for (const [role, roleID, hash] of config.ROLES) {
                if (msg.member.roles.cache.get(roleID)) {
                    needsRole = false;
                    break;
                }
            }
            if (needsRole) {
                msg.member.roles.add(config.ROLES[0][1]).catch(console.error);
            }
            } else {
            msg.channel.send(`\`${username}\` is already registered, use \`!unregister\` to be able to register with a new id`);
            }
        }).catch(error => {
            if(Array.isArray(error.fields) && error.fields[0] === 'scoreSaberID') {
            Users.findOne({where: {scoreSaberID: scoreSaberID}}).then(function (user) {
                msg.channel.send(`The ScoreSaber ID \`${scoreSaberID}\` is already used by \`${user.username}\` \`[${user.discordID}]\``);
            }).catch(console.error);
            }
            console.error(error);
        });
    }

    static removeUser(discordID: string, msg: Message) {
        Users.findOne({where: {discordID: discordID}}).then(user => {
            if (user) {
            user.destroy().then(() => {
                msg.channel.send(`Successfully unregistered \`${user.username}\` \`[${discordID}]\``);
            }).catch(console.error); 
            } else {
            msg.channel.send('That user is not registered in the database');
            }
        }).catch(console.error);
    }

    static getScoreSaberID(discordID: string, msg: Message, callback: CallableFunction) {
        Users.findOne({where: {discordID: discordID}}).then(user => {
            if (user) {
            callback(msg, user.scoreSaberID)
            } else {
            callback(msg, null)
            }
        }).catch(console.error);
    }

    static updateUser(discordID: string, scoreSaberID: string, username: string, msg: Message) {
        Users.findOne({where: {discordID: discordID}}).then(user => {
            if (user) {
            user.scoreSaberID = scoreSaberID;
            user.username = username; 
            msg.channel.send(`Successfully updated record for \`${user}\` \`[${discordID}]\``);
            } else {
            msg.channel.send('That user is not registered in the database');
            }
        }).catch(console.error);
    }

    // Returns true if the ScoreSaber ID is valid.
    static isValidSSID(SSID: string) {
        return !(isNaN(parseInt(SSID)) || SSID.length < 15 || SSID.length > 17);
    };

    // Returns true if the Discord ID is a number.
    static isValidDID(DID: string) {
        return !(isNaN(parseInt(DID)));
    }

    // Database ERROR messages
    static invalidSSIDMessage = 'That is not a valid ID. The ScoreSaber ID should be a number with 15, 16, or 17 digits' +
                    ' and can be found at the end of the url on your ScoreSaber profile: \`https://scoresaber.com/u/<ID>\`';
    static invalidDIDMessage = 'That is not a valid Discord ID.';
    static notImplementedTableMessage = 'That is not a valid table, currently implemented tables: [users / songs]';

}
