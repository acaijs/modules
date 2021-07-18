"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Classes
const InvalidRuleException_1 = __importDefault(require("../../../classes/InvalidRuleException"));
const types = {
    array: (value, args) => {
        if (!Array.isArray(value))
            return false;
        if (args.length === 1)
            return value.length < parseFloat(args[0]);
        return value.length > parseFloat(args[0]) && value.length < parseFloat(args[1]);
    },
    string: (value, args) => {
        if (typeof value !== "string")
            return false;
        if (args.length === 1)
            return value.length < parseFloat(args[0]);
        return value.length > parseFloat(args[0]) && value.length < parseFloat(args[1]);
    },
    object: (value, args) => {
        if (typeof value !== "object")
            return false;
        if (args.length === 1)
            return Object.keys(value).length < parseFloat(args[0]);
        return Object.keys(value).length > parseFloat(args[0]) && Object.keys(value).length < parseFloat(args[1]);
    },
    number: (value, args) => {
        if (typeof value !== "number")
            return false;
        if (args.length === 1)
            return `${value}`.length < parseFloat(args[0]);
        return `${value}`.length > parseFloat(args[0]) && `${value}`.length < parseFloat(args[1]);
    }
};
const rule = {
    // callbacks
    onValidate: ({ value, args, rules, key }) => {
        if (!args || args.length === 0) {
            throw new InvalidRuleException_1.default(`Rule in for field ${key} has invalid number of arguments`, { value, args, rules, key });
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
            return `${key} does not include values: ${args.filter(a => value.find(v => v !== a)).join(", ")}`;
        }
        if (rules.includes("string")) {
            if (typeof value !== "string")
                return `${key} value is not a string`;
            return `${key} does not include values: ${args.filter(a => !value.match(a)).join(", ")}`;
        }
        if (rules.includes("object")) {
            if (typeof value !== "object")
                return `${key} value is not a object`;
            return `${key} does not include values: ${args.filter(a => Object.keys(value).find(v => v !== a)).join(", ")}`;
        }
        if (rules.includes("number")) {
            if (typeof value !== "number")
                return `${key} value is not a number`;
            if (args.length === 1)
                return `${key} has a bigger value than the accepted: ${args[0]}`;
            else {
                if (value < parseFloat(args[0]))
                    return `${key} has a lower value than the accepted: ${args[0]}`;
                else
                    return `${key} has a bigger value than the accepted: ${args[1]}`;
            }
        }
    },
};
exports.default = rule;
//# sourceMappingURL=index.js.map