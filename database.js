const Sequelize = require('sequelize');
const config = require('./config');

e = module.exports;
//sequelize = new Sequelize(config.DATABASE_URL);
sequelize = new Sequelize(config.DATABASE_URL,
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

var Users = sequelize.define('users', {
  discordID: {
    primaryKey: true,
    type: Sequelize.STRING
  },
  scoreSaberID: {
    unique: true,
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  }
},{timestamps: false});

sequelize.sync();

e.addUser = (discordID, scoreSaberID, username, msg) => {
  Users.findOrCreate({
    where: {discordID: discordID}, 
    defaults: {scoreSaberID: scoreSaberID, username: username}
  }).then(function([user,created]) {
    if (created) {
      msg.channel.send(`Successfully registered \`${username}\` with ScoreSaber ID \`${scoreSaberID}\``);
      var needsRole = true;
      for (const [role, roleID, hash] of config.ROLES) {
        if (msg.member.roles.get(roleID)) {
          needsRole = false;
          break;
        }
      }
      if (needsRole) {
        msg.member.addRole(config.ROLES[0][1]).catch(console.error);
      }
    } else {
      msg.channel.send(`\`${username}\` is already registered, use \`!unregister\` to be able to register with a new id`);
    }
  }).catch(function(error){
    if(Array.isArray(error.fields) && error.fields[0] === 'scoreSaberID') {
      Users.findOne({where: {scoreSaberID: scoreSaberID}}).then(function (user) {
        msg.channel.send(`The ScoreSaber ID \`${scoreSaberID}\` is already used by \`${user.username}\` \`[${user.discordID}]\``);
      }).catch(console.error);
    }
    console.error(error);
  });
}

e.removeUser = (discordID, msg) => {
  Users.findOne({where: {discordID: discordID}}).then(function(user) {
    if (user) {
      user.destroy().then(function(existed) {
        if (existed) {
          msg.channel.send(`Successfully unregistered \`${user.username}\` \`[${discordID}]\``);
        } else {
          msg.channel.send('User already unregistered');
        }
      }).catch(console.error); 
    } else {
      msg.channel.send('That user is not registered in the database');
    }
  }).catch(console.error);
}

e.getScoreSaberID = (discordID, msg, callback) => {
  Users.findOne({where: {discordID: discordID}}).then(function(user) {
    if(user) {
      callback(msg, user.scoreSaberID)
    } else {
      callback(msg, null)
    }
  }).catch(console.error);
}

e.updateUser = (discordID, scoreSaberID, username, msg) => {
  Users.findOne({where: {discordID: discordID}}).then(function(user) {
    if(user) {
      user.scoreSaberID = scoreSaberID;
      user.username = username; 
      msg.channel.send(`Successfully updated record for \`${user}\` \`[${discordID}]\``);
    } else {
      msg.channel.send('That user is not registered in the database');
    }
  }).catch(console.error);
}

// Returns true if the ScoreSaber ID is valid.
e.isValidSSID = (SSID) => {
    return !(isNaN(SSID) || SSID.toString().length < 15 || SSID.toString().length > 17);
};

// Returns true if the Discord ID is a number.
e.isValidDID= (DID) => {
    return !(isNaN(DID));
}

// Database ERROR messages

const invalidSSIDMessage = 'That is not a valid ID. The ScoreSaber ID should be a number with 15, 16, or 17 digits' +
    ' and can be found at the end of the url on your ScoreSaber profile: \`https://scoresaber.com/u/<ID>\`';
const invalidDIDMessage = 'That is not a valid Discord ID.';
const notImplementedTableMessage = 'That is not a valid table, currently implemented tables: [users / songs]';
