"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toSid = ({ value, args, key, model }) => {
    if (model.$primary !== key)
        return value;
    if (value !== undefined && value !== null && args.nullable !== true)
        return `${value}`;
    else
        return Math.random().toString(36).substring(2, 2 + (args?.length || 11));
};
const sidType = {
    onCreate: toSid,
    onUpdate: toSid,
    onSave: toSid,
    onRetrieve: toSid,
};
exports.default = sidType;
//# sourceMappingURL=index.js.map