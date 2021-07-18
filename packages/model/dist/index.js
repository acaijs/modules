"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = exports.Hasher = exports.getModels = exports.typeManager = exports.Table = exports.Model = void 0;
var Model_1 = require("./src/modules/Model");
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return __importDefault(Model_1).default; } });
var ModelDecorator_1 = require("./src/modules/ModelDecorator");
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return __importDefault(ModelDecorator_1).default; } });
var types_1 = require("./src/types");
Object.defineProperty(exports, "typeManager", { enumerable: true, get: function () { return __importDefault(types_1).default; } });
var ModelDecorator_2 = require("./src/modules/ModelDecorator");
Object.defineProperty(exports, "getModels", { enumerable: true, get: function () { return ModelDecorator_2.getModels; } });
var Hasher_1 = require("./src/utils/Hasher");
Object.defineProperty(exports, "Hasher", { enumerable: true, get: function () { return __importDefault(Hasher_1).default; } });
const FieldDecorator_1 = __importDefault(require("./src/modules/FieldDecorator"));
const HasOneDecorator_1 = __importDefault(require("./src/modules/HasOneDecorator"));
const HasManyDecorator_1 = __importDefault(require("./src/modules/HasManyDecorator"));
const BelongsToDecorator_1 = __importDefault(require("./src/modules/BelongsToDecorator"));
exports.Field = FieldDecorator_1.default;
exports.Field.hasOne = HasOneDecorator_1.default;
exports.Field.hasMany = HasManyDecorator_1.default;
exports.Field.belongsTo = BelongsToDecorator_1.default;
//# sourceMappingURL=index.js.map