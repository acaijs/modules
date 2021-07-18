"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HasOne = (modelcb, foreignKey, primaryKey) => {
    return (target, key) => {
        const thismodel = target.constructor.prototype;
        if (!thismodel.$fields)
            thismodel.$fields = [];
        if (!thismodel.$relations)
            thismodel.$relations = [];
        thismodel.$fields.push({ name: key, type: "string", args: {} });
        thismodel.$relations.push({
            model: modelcb,
            type: "hasMany",
            name: key,
            foreignKey,
            primaryKey,
        });
    };
};
exports.default = HasOne;
//# sourceMappingURL=HasManyDecorator.js.map