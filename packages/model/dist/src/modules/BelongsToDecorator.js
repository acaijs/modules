"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BelongsTo = (modelcb, foreignKey, primaryKey) => {
    return (target, key) => {
        const thismodel = target.constructor.prototype;
        if (!thismodel.$fields)
            thismodel.$fields = [];
        if (!thismodel.$relations)
            thismodel.$relations = [];
        const extraargs = {};
        if (foreignKey.match(/^\w+\?/))
            extraargs.nullable = true;
        if (foreignKey.match(/^\w+\!/))
            extraargs.unique = true;
        thismodel.$fields.push({ name: key, type: "string", args: extraargs });
        thismodel.$relations.push({
            model: modelcb,
            type: "belongsTo",
            name: key,
            foreignKey: foreignKey.match(/^\w+/)[0],
            primaryKey,
        });
    };
};
exports.default = BelongsTo;
//# sourceMappingURL=BelongsToDecorator.js.map