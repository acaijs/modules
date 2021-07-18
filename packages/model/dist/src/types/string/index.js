"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toString = ({ value, args }) => {
    const format = (value === undefined || value === null) ? "" : `${value}`;
    if (args) {
        if (args.max && args.max < format.length)
            return format.substring(0, args.max);
    }
    return format;
};
const stringType = {
    onCreate: toString,
    onUpdate: toString,
    onSave: toString,
    onRetrieve: toString,
};
exports.default = stringType;
//# sourceMappingURL=index.js.map