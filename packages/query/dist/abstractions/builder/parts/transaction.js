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
const table_1 = require("./table");
class TransactionClass extends table_1.default {
    transact(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.startTransaction();
            try {
                yield callback({
                    savePoint: this.savepointTransaction,
                    release: this.releaseTransaction,
                });
            }
            catch (e) {
                yield this.rollbackTransaction();
                throw e;
            }
            yield this.commitTransaction();
        });
    }
    startTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getAdapter().startTransaction();
        });
    }
    savepointTransaction(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getAdapter().savepointTransaction(name);
        });
    }
    releaseTransaction(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getAdapter().releaseTransaction(name);
        });
    }
    rollbackTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getAdapter().rollbackTransaction();
        });
    }
    commitTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getAdapter().commitTransaction();
        });
    }
}
exports.default = TransactionClass;
//# sourceMappingURL=transaction.js.map