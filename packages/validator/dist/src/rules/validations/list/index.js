"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: (v, _, _1, a) => {
        return a.includes(v);
    },
    onError: (v, k) => `${v} in ${k} is not a valid value`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map