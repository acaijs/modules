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
exports.add = exports.append = exports.get = void 0;
// Utils
const assertions_1 = require("./assertions");
const general_1 = require("./general");
const tests = [];
let only = false;
let except = false;
const get = (tag, filter = false) => {
    return tests
        .filter(test => {
        if (filter) {
            if (only)
                return test.only;
            if (except)
                return !test.except;
            if (tag.length)
                return tag.find(tag => test.tags.find(subtag => subtag === tag));
        }
        return true;
    })
        .sort((test1, test2) => {
        // same group, keep it as it is
        if (general_1.isArrayEquals(test1.group, test2.group))
            return 0;
        if (test1.group.length > test2.group.length)
            return test1.group.filter((item, index) => item === test2.group[index]).length - 1;
        return test2.group.filter((item, index) => item === test1.group[index]).length + 1;
    });
};
exports.get = get;
const append = (test) => {
    tests[tests.length - 1] = Object.assign(Object.assign(Object.assign({}, tests[tests.length - 1]), test), { tags: [...(tests[tests.length - 1].tags || []), ...(test.tags || [])], messages: [...(tests[tests.length - 1].messages || []), ...(test.messages || [])] });
};
exports.append = append;
const add = (pretest) => {
    // filter for perfomance
    if (pretest.only)
        only = true;
    if (pretest.except)
        except = true;
    // build test
    const test = Object.assign({ only: false, except: false, fail: false, assertions: [], messages: [] }, pretest);
    // encapsulate callback
    const rawcallback = test.callback;
    test.callback = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield rawcallback(assertions_1.default(test));
        }
        catch (e) {
            test.fail = true;
            test.assertions.push({
                type: "test",
                fail: true,
                message: `Exception thrown`,
                name: e.message,
                stack: general_1.getStackTrace(1, e),
            });
        }
    });
    // add to list
    tests.push(test);
};
exports.add = add;
//# sourceMappingURL=test.js.map