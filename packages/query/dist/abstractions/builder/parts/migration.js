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
const transaction_1 = require("./transaction");
class MigrationClass extends transaction_1.default {
    // -------------------------------------------------
    // migration methods
    // -------------------------------------------------
    static addMigration(table, columns) {
        this.adapter.addMigration(table, columns);
    }
    static runMigrations() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.runMigrations();
        });
    }
}
exports.default = MigrationClass;
//# sourceMappingURL=migration.js.map