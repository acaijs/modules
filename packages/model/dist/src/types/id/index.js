"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toInt = ({ value }) => {
    const format = parseInt(value);
    return format;
};
const idType = {
    type: {
        type: "int",
        length: 21,
    },
    onCreate: toInt,
    onUpdate: toInt,
    onSave: toInt,
    onRetrieve: toInt,
};
exports.default = idType;
//# sourceMappingURL=index.js.map