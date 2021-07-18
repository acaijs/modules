"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Classes
const InvalidRuleException_1 = require("../../../classes/InvalidRuleException");
const types = {
    array: (value, args) => Array.isArray(value) && value.length >= parseInt(args[0]),
    object: (value, args) => typeof value === "object" && Object.keys(value).length >= parseInt(args[0]),
    string: (value, args) => typeof value === "string" && value.length >= parseInt(args[0]),
    number: (value, args) => typeof value === "number" && value >= parseInt(args[0]),
};
const rule = {
    // callbacks
    onValidate: ({ value, args, rules, key }) => {
        if (!args || args.length !== 1) {
            throw new InvalidRuleException_1.default(`Rule 'min' for field ${key} has invalid number of arguments`, { value, args, rules, key });
        }
        if (rules.includes("array"))
            return types.array(value, args);
        else if (rules.includes("string"))
            return types.string(value, args);
        else if (rules.includes("object"))
            return types.object(value, args);
        else if (rules.includes("number"))
            return types.number(value, args);
        return false;
    },
    onError: ({ rules, value, key, args }) => {
        if (rules.includes("array")) {
            if (!Array.isArray(value))
                return `${key} value is not an array`;
            return `${key} has less elements than the allowed: ${args[0]}`;
        }
        if (rules.includes("string")) {
            if (typeof value !== "string")
                return `${key} value is not a string`;
            return `${key} has less characters than the allowed: ${args[0]}`;
        }
        if (rules.includes("object")) {
            if (typeof value !== "object")
                return `${key} value is not a object`;
            return `${key} has less keys than the allowed: ${args[0]}`;
        }
        if (rules.includes("number")) {
            if (typeof value !== "number")
                return `${key} value is not a number`;
            return `${key} is less than the allowed: ${args[0]}`;
        }
    },
};
exports.default = rule;
//# sourceMappingURL=index.js.map