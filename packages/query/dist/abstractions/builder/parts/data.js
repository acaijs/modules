"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Parts
const static_1 = require("./static");
class DataClass extends static_1.default {
    constructor() {
        // -------------------------------------------------
        // data methods
        // -------------------------------------------------
        super(...arguments);
        this.raw = (query, params = []) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().raw(query, params);
        });
        this.count = (column) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().count(this.tableName, column || "*", this.queryBuild.logic.length > 0 ? this.queryBuild : undefined);
        });
        this.avg = (column) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().avg(this.tableName, column, this.queryBuild.logic.length > 0 ? this.queryBuild : undefined);
        });
        this.sum = (column) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().sum(this.tableName, column, this.queryBuild.logic.length > 0 ? this.queryBuild : undefined);
        });
    }
}
exports.default = DataClass;
//# sourceMappingURL=data.js.map