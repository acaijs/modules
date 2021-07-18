"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeatString = exports.isArrayEquals = exports.getStackTrace = void 0;
const getStackTrace = (index = 4, prestack) => {
    var stack = prestack === null || prestack === void 0 ? void 0 : prestack.stack;
    if (!stack) {
        try {
            throw new Error('');
        }
        catch (error) {
            stack = error.stack || '';
        }
    }
    return stack.split("\n").slice(index).join("\n");
};
exports.getStackTrace = getStackTrace;
const isArrayEquals = (arr1, arr2) => {
    if (arr1.length !== arr2.length)
        return false;
    return arr1.filter((item, index) => item !== arr2[index]).length === 0;
};
exports.isArrayEquals = isArrayEquals;
const repeatString = (text, times) => {
    let response = "";
    for (let i = 0; i < times; i++) {
        response += text;
    }
    return response;
};
exports.repeatString = repeatString;
//# sourceMappingURL=general.js.map