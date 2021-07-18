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
const query_1 = require("./query");
class TableClass extends query_1.default {
    constructor() {
        // -------------------------------------------------
        // table methods
        // -------------------------------------------------
        super(...arguments);
        this.getColumns = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getAdapter().getColumns(this.tableName);
            return result;
        });
    }
    createTable(columns) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().createTable(this.tableName, columns);
        });
    }
    alterTable(columns) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().alterTable(this.tableName, columns);
        });
    }
    dropTable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().dropTable(this.tableName);
        });
    }
    existsTable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().existsTable(this.tableName);
        });
    }
}
exports.default = TableClass;
//# sourceMappingURL=table.js.map