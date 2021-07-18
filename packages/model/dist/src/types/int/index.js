"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toInt = ({ value, args }) => {
    if (args?.nullable && (value === null || value === undefined))
        return null;
    const format = parseInt(value);
    if (args) {
        if (args.max && args.max < format)
            return args.max;
        if (args.min && args.min > format)
            return args.min;
    }
    return format;
};
const intType = {
    type: {
        type: "int"
    },
    onCreate: toInt,
    onUpdate: toInt,
    onSave: toInt,
    onRetrieve: toInt,
};
exports.default = intType;
//# sourceMappingURL=index.js.map