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
    const format = luxon_1.DateTime.isDateTime(value) ? value : luxon_1.DateTime.fromJSDate(value);
    if (args) {
        if (args.format) {
            return format.toFormat(args.format);
        }
    }
    return format.toISOTime();
};
const timeType = {
    type: {
        type: "time",
    },
    onCreate: toDate,
    onRetrieve: toDate,
    onSave: toSerializeDate,
    onSerialize: toSerializeDate,
};
exports.default = timeType;
//# sourceMappingURL=index.js.map