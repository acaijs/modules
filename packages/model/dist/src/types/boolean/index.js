"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toBoolean = ({ value }) => {
    return !!value;
};
const toDatabaseBoolean = ({ value }) => {
    return !!value ? 1 : 0;
};
const booleanType = {
    type: {
        type: "int",
    },
    onSave: toDatabaseBoolean,
    onCreate: toBoolean,
    onRetrieve: toBoolean,
    onSerialize: toBoolean,
};
exports.default = booleanType;
//# sourceMappingURL=index.js.map