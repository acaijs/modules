"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const toUuid = ({ value, key, args, model }) => {
    if (model.$primary !== key)
        return value;
    if (value !== undefined && value !== null && args.nullable !== true)
        return `${value}`;
    else
        return uuid_1.v4();
};
const uuidType = {
    type: {
        type: "string",
        length: 36,
    },
    onCreate: toUuid,
    onUpdate: toUuid,
    onSave: toUuid,
    onRetrieve: toUuid,
};
exports.default = uuidType;
//# sourceMappingURL=index.js.map