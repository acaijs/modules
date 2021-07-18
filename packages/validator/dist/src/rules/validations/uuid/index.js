"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value }) => !!((typeof value === "string") && value.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)),
    onError: ({ key }) => `${key} is not a valid uuid`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map