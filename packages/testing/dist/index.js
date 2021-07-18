"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Modules
const run_1 = require("./src/modules/run");
const test_1 = require("./src/modules/test");
const find_1 = require("./src/modules/find");
const cache_1 = require("./src/modules/cache");
const group_1 = require("./src/modules/group");
const only_1 = require("./src/modules/only");
const except_1 = require("./src/modules/except");
const tag_1 = require("./src/modules/tag");
const print_1 = require("./src/modules/print");
const runAndPrint_1 = require("./src/modules/runAndPrint");
// build
const test = test_1.default;
test.run = run_1.default;
test.find = find_1.default;
test.group = group_1.default;
test.cache = cache_1.default;
test.only = only_1.default;
test.except = except_1.default;
test.tag = tag_1.default;
test.print = print_1.default;
test.runAndPrint = runAndPrint_1.default;
// export
exports.default = test;
// run from command line
if (process.argv.includes("--run")) {
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = process.argv.includes("--path") && process.argv[process.argv.indexOf("--path") + 1];
            const tags = `${process.argv.includes("--tags") && process.argv[process.argv.indexOf("--tags") + 1] || ""}`.split(",").filter(i => i);
            const all = process.argv.includes("--all");
            const print = !process.argv.includes("--no-print");
            yield test.find(path || "./**/*.{test,tests}.{js,ts}");
            yield test.runAndPrint({
                tags: tags,
                forceAll: all,
                spinner: print,
            });
        });
    }
    main();
}
//# sourceMappingURL=index.js.map