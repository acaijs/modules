"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@acai/testing");
async function main() {
    await testing_1.default.find("./*/*(*.test.js|*.test.ts)");
    await testing_1.default.run();
}
main();
//# sourceMappingURL=test.js.map