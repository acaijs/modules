"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModels = void 0;
const models = [];
const ModelDecorator = (table, primary = "id") => {
    return (target) => {
        const model = target;
        model.$table = table;
        model.$primary = primary;
        models.push(model);
    };
};
exports.default = ModelDecorator;
const getModels = () => models;
exports.getModels = getModels;
//# sourceMappingURL=ModelDecorator.js.map