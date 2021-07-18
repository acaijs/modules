"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule = {
    // callbacks
    onValidate: ({ value, key, fields }) => fields[`${key}_confirmation`] && fields[`${key}_confirmation`] === value,
    onError: ({ value, key, fields }) => {
        if (!fields[`${key}_confirmation`]) {
            return `${key} is not confirmed`;
        }
        if (fields[`${key}_confirmation`] !== value) {
            return `${key} confirmation does not match`;
        }
    },
};
exports.default = rule;
//# sourceMappingURL=index.js.map