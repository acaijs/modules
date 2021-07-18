"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value }) => Array.isArray(value),
    onError: ({ key }) => `${key} is not an array`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map