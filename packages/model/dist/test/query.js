"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("@acai/query"));
const user_1 = __importDefault(require("./classes/user"));
const setup_1 = __importDefault(require("./utils/setup"));
async function getUser() {
    const user = await user_1.default.first();
    if (user)
        return user;
    return user_1.default.insert({
        name: "hi",
        age: 10
    });
}
async function main() {
    await setup_1.default();
    const user = await getUser();
    console.log(await user.comments.query().count());
    await query_1.default().close();
}
main();
//# sourceMappingURL=query.js.map