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
const properties_1 = require("./properties");
class StaticClass extends properties_1.default {
    // -------------------------------------------------
    // static methods
    // -------------------------------------------------
    static toggleAdapter(adapter, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.adapter = new adapter();
            if (settings)
                this.settings = settings;
            return yield this.adapter.build(this.settings);
        });
    }
    static toggleSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = settings;
            return yield this.adapter.build(this.settings);
        });
    }
    static isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.isConnected();
        });
    }
    static hasErrors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.hasErrors();
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.close();
        });
    }
    static table(table) {
        const query = new this();
        query.table(table);
        return query;
    }
}
exports.default = StaticClass;
//# sourceMappingURL=static.js.map