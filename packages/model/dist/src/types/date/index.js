"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const toDate = ({ value }) => {
    if (luxon_1.DateTime.isDateTime(value))
        return value;
    if (typeof value === "string")
        return luxon_1.DateTime.fromISO(value);
    if (typeof value === "number")
        return luxon_1.DateTime.fromMillis(value);
    if (value instanceof Date)
        return luxon_1.DateTime.fromJSDate(value);
    return value;
};
const toSerializeDate = ({ value, args }) => {
    const _value = luxon_1.DateTime.isDateTime(value) ? value : luxon_1.DateTime.fromJSDate(value);
    if (args) {
        if (args.format) {
            return _value.toFormat(args.format);
        }
    }
    return _value.toISODate();
};
const dateType = {
    type: {
        type: "date",
    },
    onCreate: toDate,
    onRetrieve: toDate,
    onSave: toSerializeDate,
    onSerialize: toSerializeDate,
};
exports.default = dateType;
//# sourceMappingURL=index.js.map