"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value, args }) => {
        if ((args && args.includes("force") && !isNaN(value)) || typeof value === "number") {
            return parseFloat(value) === parseInt(value);
        }
        return false;
    },
    onMask: ({ value }) => parseFloat(value),
    onError: ({ key }) => `${key} is not an integer`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map