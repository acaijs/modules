"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value }) => typeof value === "string",
    onError: ({ key }) => `${key} is not a string`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map