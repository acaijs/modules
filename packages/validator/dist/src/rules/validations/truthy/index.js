"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value }) => !!value,
    onError: ({ key }) => `${key} is not truthy`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map