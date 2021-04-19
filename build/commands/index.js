"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const rankup_1 = __importDefault(require("./rankup"));
const register_1 = __importDefault(require("./register"));
const unregister_1 = __importDefault(require("./unregister"));
class Commands {
}
Commands.commands = [
    new db_1.default(),
    new rankup_1.default(),
    new register_1.default(),
    new unregister_1.default()
];
exports.default = Commands.commands;
//# sourceMappingURL=index.js.map