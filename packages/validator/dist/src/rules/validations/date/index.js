"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const luxon_1 = require("luxon");
const rule = {
    // callbacks
    onValidate: ({ value, args }) => {
        if (args && args[0])
            return luxon_1.DateTime.fromFormat(value, args[0]).isValid;
        return luxon_1.DateTime.fromISO(value).isValid;
    },
    onError: ({ key }) => `${key} is not a valid date`,
};
exports.default = rule;
//# sourceMappingURL=index.js.map