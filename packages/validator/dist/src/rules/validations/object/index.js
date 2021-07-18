"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value }) => typeof value === "object",
    onError: ({ key }) => `${key} is not an object`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map