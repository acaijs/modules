"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const toDate = ({ value }) => {
    if (luxon_1.DateTime.isDateTime(value))
        return value;
    if (typeof value === "string")
        return luxon_1.DateTime.fromSeconds(parseInt(value));
    if (typeof value === "number")
        return luxon_1.DateTime.fromMillis(value);
    if (value instanceof Date)
        return luxon_1.DateTime.fromJSDate(value);
    return value;
};
const toSerializeDate = ({ value }) => {
    if (value) {
        const format = luxon_1.DateTime.isDateTime(value) ? value : luxon_1.DateTime.fromJSDate(value);
        return format.toFormat("yyyy-LL-dd HH:mm:ss");
    }
};
const timestampType = {
    type: {
        type: "timestamp",
    },
    onCreate: toDate,
    onRetrieve: toDate,
    onSave: toSerializeDate,
    onSerialize: toSerializeDate,
};
exports.default = timestampType;
//# sourceMappingURL=index.js.map