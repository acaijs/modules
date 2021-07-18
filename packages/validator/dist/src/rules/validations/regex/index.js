"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Classes
const InvalidRuleException_1 = require("../../../classes/InvalidRuleException");
const rule = {
    // callbacks
    onValidate: ({ value, args, rules, key }) => {
        if (typeof value !== "string")
            return false;
        if (!args || args.length !== 1) {
            throw new InvalidRuleException_1.default(`Rule 'regex' for field ${key} has invalid number of arguments`, { value, args, rules, key });
        }
        try {
            "".match(new RegExp(args[0]));
        }
        catch (e) {
            throw new InvalidRuleException_1.default(`Rule 'regex' for field ${key} has a invalid regex pattern (${args[0]})`, { value, args, rules, key });
        }
        return !!value.match(new RegExp(args[0]));
    },
    onError: ({ key }) => `${key} does not passes the regex`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map