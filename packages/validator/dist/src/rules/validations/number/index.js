"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value, args }) => {
        if (args && args.includes("force"))
            return !isNaN(value);
        return typeof value === "number";
    },
    onMask: ({ value }) => parseFloat(value),
    onError: ({ key }) => `${key} is not a number`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map