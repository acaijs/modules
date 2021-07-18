"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field = (type = "string", args) => {
    return (target, key) => {
        const model = target.constructor.prototype;
        if (!model.$fields)
            model.$fields = [];
        const extraargs = {};
        if (type.match(/^\w+\?/))
            extraargs.nullable = true;
        if (type.match(/^\w+\*/))
            extraargs.primary = true;
        if (type.match(/^\w+\!/))
            extraargs.unique = true;
        if (type.match(/^\w+\=/))
            extraargs.default = type.split("=")[1];
        model.$fields.push({
            name: key,
            type: type.match(/^\w+/)[0],
            args: { ...args, ...extraargs },
        });
    };
};
exports.default = Field;
//# sourceMappingURL=FieldDecorator.js.map