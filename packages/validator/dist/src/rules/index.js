"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRules = exports.setRules = exports.setRule = void 0;
// Validation rules
const array_1 = require("./validations/array");
const confirmed_1 = require("./validations/confirmed");
const email_1 = require("./validations/email");
const uuid_1 = require("./validations/uuid");
const object_1 = require("./validations/object");
const required_1 = require("./validations/required");
const string_1 = require("./validations/string");
const number_1 = require("./validations/number");
const in_1 = require("./validations/in");
const notIn_1 = require("./validations/notIn");
const integer_1 = require("./validations/integer");
const truthy_1 = require("./validations/truthy");
const min_1 = require("./validations/min");
const max_1 = require("./validations/max");
const regex_1 = require("./validations/regex");
const date_1 = require("./validations/date");
// list
let ruleList = {
    // general
    "confirmed": confirmed_1.default,
    "required": required_1.default,
    "truthy": truthy_1.default,
    // string
    "email": email_1.default,
    "uuid": uuid_1.default,
    "regex": regex_1.default,
    "date": date_1.default,
    // composite
    "in": in_1.default,
    "notIn": notIn_1.default,
    "min": min_1.default,
    "max": max_1.default,
    // type
    "object": object_1.default,
    "string": string_1.default,
    "array": array_1.default,
    "number": number_1.default,
    // number
    "float": number_1.default,
    "integer": integer_1.default,
    "int": integer_1.default,
};
// methods
function setRule(name, rule) {
    ruleList[name] = rule;
}
exports.setRule = setRule;
function setRules(rules) {
    Object.keys(rules).forEach(name => {
        ruleList[name] = rules[name];
    });
}
exports.setRules = setRules;
function clearRules() {
    ruleList = {};
}
exports.clearRules = clearRules;
// default
exports.default = () => ruleList;
//# sourceMappingURL=index.js.map