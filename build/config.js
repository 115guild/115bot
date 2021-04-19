"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    PORT: process.env.PORT || 3000,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    REGISTER_CHANNEL_ID: process.env.REGISTER_CHANNEL_ID,
    RANKUP_CHANNEL_ID: process.env.RANKUP_CHANNEL_ID,
    DB_CHANNEL_ID: process.env.DB_CHANNEL_ID,
    ROLES: [
        ['Novice', process.env.NOVICE_ROLE_ID],
        ['Apprentice', process.env.APPRENTICE_ROLE_ID, process.env.APPRENTICE_HASH_ID],
        ['Adept', process.env.ADEPT_ROLE_ID, process.env.ADEPT_HASH_ID],
        ['Expert', process.env.EXPERT_ROLE_ID, process.env.EXPERT_HASH_ID],
        ['Master', process.env.MASTER_ROLE_ID, process.env.MASTER_HASH_ID],
        ['Legend', process.env.LEGEND_ROLE_ID, process.env.LEGEND_HASH_ID]
    ],
    SQLITE_PATH: process.env.SQLITE_PATH || './db.sqlite',
    DATABASE_URL: process.env.DATABASE_URL || "sqlite:" + module.exports.SQLITE_PATH
};
//# sourceMappingURL=config.js.map