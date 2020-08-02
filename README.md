# 115BOT
This is the bot that controls the campaign ranks on the 115 Guild discord!\
Join 115 Guild discord here! https://discord.gg/j8m8cxr
# TODO: Write about bot usage

# Environment Variables
These affect the bot's behavior, and largely, without them the bot won't wor
## Connections Config
**PORT [Default: 3000]**\
The port the HTTP server runs on (this just has a / call for pinging/healthcheck purposes)
 
**DATABASE_URL [Default: "sqlite:" + SQLITE_PATH]**\
(You do not need to set this variable if you intend on using SQLITE_PATH)\
This is a connection string to sql database.  Possible sql databases are whatever is supported by\
[https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database](https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database)\
Note that on Heroku, this is automatically assigned if you link a Heroku Postgres database to your app

**SQLITE_PATH [Default: ./db.sqlite]**\
The path to the sqlite file (the default on disk database)\
This is unused if you change DATABASE_URL
## Discord Bot Token

**DISCORD_TOKEN [No Default, but this is REQUIRED]**\
The Token for your Discord Bot, which allows this bot to connect\
If you don't know what this is, read [https://www.writebots.com/discord-bot-token/](https://www.writebots.com/discord-bot-token/)
## Various Discord Ids

These are Discord IDs for various things like roles, channels, etc\
See this page if you don't know how to find these IDs [https://imgur.com/gallery/2jxgMBg](https://imgur.com/gallery/2jxgMBg)
None of these have default values and they all must be set

**REGISTER_CHANNEL_ID:** The channel where users should !register with the bot\
**RANKUP_CHANNEL_ID:** The channel where users should run the !rankup command\
**DB_CHANNEL_ID:**  The channel where an admin can run commands against the db

These are the discord roles associated with campaign milestones\
**NOVICE_ROLE_ID**\
**APPRENTICE_ROLE_ID**\
**ADEPT_ROLE_ID**\
**EXPERT_ROLE_ID**\
**MASTER_ROLE_ID**\
**LEGEND_ROLE_ID**

## Milestone Song Hashes
These are the Hash IDs for the Beat Saver songs for Milestones\
**NOVICE_HASH_ID**\
**APPRENTICE_HASH_ID**\
**ADEPT_HASH_ID**\
**EXPERT_HASH_ID**\
**MASTER_HASH_ID**\
**LEGEND_HASH_ID**
