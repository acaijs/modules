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
// Utils
const general_1 = require("../utils/general");
function run(tests, contextErrors = [], elapsedTime = [0, 0]) {
    return __awaiter(this, void 0, void 0, function* () {
        console.clear();
        console.log();
        // -------------------------------------------------
        // Display tests
        // -------------------------------------------------
        console.log("===============================");
        console.log(` Tests ran`);
        console.log("===============================");
        console.log();
        if (tests.length === 0) {
            console.log("no test to run");
        }
        else {
            let lastgroup = [];
            tests.forEach(test => {
                // print test group
                if (!general_1.isArrayEquals(test.group, lastgroup)) {
                    test.group.forEach((item, index) => {
                        var _a;
                        if (lastgroup[index] !== item) {
                            const fails = (((_a = contextErrors.find(i => general_1.isArrayEquals(i.group, test.group))) === null || _a === void 0 ? void 0 : _a.fails) || []).map(i => `\x1b[31m${i.type}\x1b[37m`).join(",");
                            console.log(`\n${general_1.repeatString("\t", index)} ${item}${fails ? ` (${fails})` : ""}`);
                        }
                    });
                    lastgroup = test.group;
                }
                // prepare assertions print
                const fail = !!test.assertions.find(a => a.fail);
                const assertions = test.assertions.map(i => `${i.fail ? "\x1b[31m" : "\x1b[32m"}${i.type}\x1b[37m`).join(", ");
                console.log(`${general_1.repeatString("\t", lastgroup.length - 1)} ${lastgroup.length !== 0 ? " " : ""}${fail ? "\x1b[31mx" : "\x1b[32m√\x1b[37m"}\x1b[37m - ${test.title} (${assertions ? assertions : "no assertions made"})`);
            });
        }
        // -------------------------------------------------
        // Display errors
        // -------------------------------------------------
        const [total, success] = [tests.length, tests.filter(test => !test.assertions.find(a => a.fail)).length];
        if (total !== success) {
            console.log();
            console.log("===============================");
            console.log(` Tests failed`);
            console.log("===============================");
            console.log();
            tests.forEach(test => {
                test.assertions.forEach(assertion => {
                    if (assertion.fail) {
                        console.log(` \x1b[31mx\x1b[37m - ${test.group.join(" \x1b[36m>\x1b[37m ")}${test.group.length > 0 ? "\x1b[36m>\x1b[37m " : ""}${test.title}`);
                        console.log("\x1b[31m");
                        console.log(`  ${assertion.message}`);
                        console.log(`    ${assertion.name}`);
                        console.log(`${assertion.stack}`);
                        console.log("\x1b[37m");
                    }
                });
            });
        }
        if (contextErrors.length) {
            console.log();
            contextErrors.forEach((group) => {
                group.fails.forEach((fail) => {
                    console.log(` \x1b[31mx\x1b[37m - ${group.group.join(" \x1b[36m>\x1b[37m ")}`);
                    console.log("\x1b[31m");
                    console.log(`  ${fail.message}`);
                    console.log();
                    console.log(fail.title);
                    console.log(` ${fail.stack}`);
                    console.log("\x1b[37m");
                });
            });
        }
        // -------------------------------------------------
        // Display messages
        // -------------------------------------------------
        if (tests.find(i => i.messages.length > 0)) {
            console.log();
            console.log("===============================");
            console.log(` Tests messages`);
            console.log("===============================");
            console.log();
            tests.forEach(test => {
                if (test.messages.length > 0) {
                    test.messages.forEach(message => {
                        console.log(`•${test.group.join(" \x1b[36m>\x1b[37m ")} ${test.group.length > 0 ? "\x1b[36m>\x1b[37m " : ""}${test.title}`);
                        if (message[1])
                            console.log(`message: ${message[1]}`);
                        console.log("value:", message[0]);
                        console.log();
                    });
                }
            });
        }
        // -------------------------------------------------
        // Display statistics
        // -------------------------------------------------
        const totalMs = Math.ceil((elapsedTime[0] * 1000000000 + elapsedTime[1]) / 1000000);
        const minutes = Math.floor(totalMs / 60000);
        const seconds = Math.floor(totalMs / 1000) - minutes * 60;
        const milisec = totalMs % 1000;
        console.log();
        console.log("===============================");
        console.log(` Tests results`);
        console.log("===============================");
        console.log();
        console.log(` Total tests:\t\t${total}`);
        console.log(` Successful tests:\t${success}`);
        console.log(` Total time elapsed:\t${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s ` : ""}${milisec}ms`);
        console.log();
        if (total !== success)
            process.exit(1);
    });
}
exports.default = run;
//# sourceMappingURL=print.js.map