"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const testing_1 = __importDefault(require("@acai/testing"));
async function main() {
    const path = process.argv.includes("--path") && process.argv[process.argv.indexOf("--path") + 1];
    const tags = `${process.argv.includes("--tags") && process.argv[process.argv.indexOf("--tags") + 1] || ""}`.split(",").filter(i => i);
    const all = process.argv.includes("--all");
    const print = !process.argv.includes("--no-print");
    await testing_1.default.find(path || "./src/**/*.{test,tests}.{js,ts}");
    await testing_1.default.runAndPrint({
        tags: tags,
        forceAll: all,
        spinner: print,
    });
    process.exit(0);
}
main();
//# sourceMappingURL=test.js.map