"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("@acai/query"));
const user_1 = __importDefault(require("./classes/user"));
const comment_1 = __importDefault(require("./classes/comment"));
const setup_1 = __importDefault(require("./utils/setup"));
async function main() {
    await setup_1.default();
    console.clear();
    console.log("connection to database made");
    user_1.default.addMigration();
    comment_1.default.addMigration();
    console.log("added migrations");
    await query_1.default().runMigrations();
    console.log("migrations updated");
    await query_1.default().close();
}
main();
//# sourceMappingURL=migrate.js.map