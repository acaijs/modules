"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toJson = ({ value }) => {
    if (typeof value === "string")
        return JSON.parse(value);
    if (value === undefined)
        return {};
    return value;
};
const jsonType = {
    type: {
        type: "json"
    },
    onSerialize: toJson,
    onCreate: toJson,
    onUpdate: toJson,
    onSave: ({ value }) => value ? JSON.stringify(value) : value,
    onRetrieve: toJson,
};
exports.default = jsonType;
//# sourceMappingURL=index.js.map