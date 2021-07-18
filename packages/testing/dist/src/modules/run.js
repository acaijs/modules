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
exports.getCurr = void 0;
// Utils
const GroupQueue = require("../utils/group");
const TestQueue = require("../utils/test");
const ContextQueue = require("../utils/context");
const general_1 = require("../utils/general");
let currTest;
const getCurr = () => currTest;
exports.getCurr = getCurr;
function run(settings) {
    return __awaiter(this, void 0, void 0, function* () {
        // -------------------------------------------------
        // Run all groups
        // -------------------------------------------------
        for (let groups = GroupQueue.get(); groups.length > 0; groups = GroupQueue.get()) {
            GroupQueue.clear();
            yield Promise.all(groups.map((group) => {
                ContextQueue.set(group.ctx);
                return group.cb({});
            }));
        }
        // -------------------------------------------------
        // Filter
        // -------------------------------------------------
        const tests = TestQueue.get((settings === null || settings === void 0 ? void 0 : settings.tags) || [], !(settings === null || settings === void 0 ? void 0 : settings.forceAll));
        const contextFails = [];
        // -------------------------------------------------
        // Run tests
        // -------------------------------------------------
        const states = ["─", "\\", "|", "/"];
        let testsrun = 0;
        let laststep = 0;
        const waitProcess = setInterval(() => {
            if ((settings === null || settings === void 0 ? void 0 : settings.spinner) !== false) {
                console.clear();
                console.log(`\n ${states[laststep]} (${testsrun}/${tests.length}) Running tests`);
                if (laststep + 2 > states.length)
                    laststep = 0;
                else
                    laststep++;
            }
        }, 250);
        // -------------------------------------------------
        // Run tests
        // -------------------------------------------------
        let lastcontext = [];
        let lasttest;
        const processStart = process.hrtime();
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            currTest = test;
            // check context for beforeAll
            if (!general_1.isArrayEquals(lastcontext, test.group)) {
                try {
                    yield Promise.all(test.beforeAll.map(i => i()));
                }
                catch (e) {
                    let ctx = contextFails.find(i => general_1.isArrayEquals(i.group, test.group));
                    if (!ctx) {
                        contextFails.push({
                            group: test.group,
                            fails: [],
                        });
                        ctx = contextFails[contextFails.length - 1];
                    }
                    ctx.fails.push({
                        title: e.message,
                        type: "beforeAll",
                        message: "An error has occured while running beforeAll callback",
                        stack: general_1.getStackTrace(1, e),
                    });
                }
            }
            // check context for before each
            try {
                yield Promise.all(test.beforeEach.map(i => i()));
            }
            catch (e) {
                test.assertions.push({
                    type: "beforeEach",
                    message: "An error has occured while running beforeEach callback",
                    stack: general_1.getStackTrace(1, e),
                    fail: true,
                });
                let ctx = contextFails.find(i => general_1.isArrayEquals(i.group, test.group));
                if (!ctx) {
                    contextFails.push({
                        group: test.group,
                        fails: [],
                    });
                    ctx = contextFails[contextFails.length - 1];
                }
                ctx.fails.push({
                    title: e.message,
                    type: "beforeEach",
                    message: "An error has occured while running beforeEach callback",
                    stack: general_1.getStackTrace(1, e),
                });
            }
            // update context
            lastcontext = test.group;
            lasttest = test;
            testsrun++;
            // run test
            try {
                yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    // timer for timeout
                    const timer = setTimeout(() => { reject(""); }, test.timeout || (settings === null || settings === void 0 ? void 0 : settings.timeout) || 2000);
                    // test to run
                    yield test.callback();
                    clearTimeout(timer);
                    resolve("");
                }));
            }
            catch (e) {
                test.assertions.push({
                    type: "timeout",
                    message: "Timeout",
                    name: "Your test has thrown an timeout after it has been unnresponsive for 2 seconds, you can change this time by changing the run settings timeout or changing the test timeout",
                    stack: "",
                    fail: true,
                });
            }
            // check context for after each
            try {
                yield Promise.all(test.afterEach.map(i => i()));
            }
            catch (e) {
                test.assertions.push({
                    type: "afterEach",
                    message: "An error has occured while running afterEach callback",
                    stack: general_1.getStackTrace(1, e),
                    fail: true,
                });
                let ctx = contextFails.find(i => general_1.isArrayEquals(i.group, test.group));
                if (!ctx) {
                    contextFails.push({
                        group: test.group,
                        fails: [],
                    });
                    ctx = contextFails[contextFails.length - 1];
                }
                ctx.fails.push({
                    title: e.message,
                    type: "afterEach",
                    message: "An error has occured while running afterEach callback",
                    stack: general_1.getStackTrace(1, e),
                });
            }
        }
        // check context for after All
        if (lasttest) {
            try {
                yield Promise.all(lasttest.afterAll.map(i => i()));
            }
            catch (e) {
                let ctx = contextFails.find(i => general_1.isArrayEquals(i.group, lasttest.group));
                if (!ctx) {
                    contextFails.push({
                        group: lasttest.group,
                        fails: [],
                    });
                    ctx = contextFails[contextFails.length - 1];
                }
                ctx.fails.push({
                    title: e.message,
                    type: "afterAll",
                    message: "An error has occured while running afterAll callback",
                    stack: general_1.getStackTrace(1, e),
                });
            }
        }
        const processEnd = process.hrtime(processStart);
        clearInterval(waitProcess);
        if ((settings === null || settings === void 0 ? void 0 : settings.spinner) !== false) {
            console.clear();
        }
        return [tests, contextFails, processEnd];
    });
}
exports.default = run;
//# sourceMappingURL=run.js.map