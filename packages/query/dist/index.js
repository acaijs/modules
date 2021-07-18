"use strict";
// -------------------------------------------------
// Imports
// -------------------------------------------------
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
exports.SqlQuery = exports.AbstractQuery = exports.setDefault = exports.addQuery = void 0;
const sql_1 = require("./classes/queryStrategies/sql");
const sql_2 = require("./classes/queryStrategies/sql");
// -------------------------------------------------
// Configurations
// -------------------------------------------------
const queries = {};
function addQuery(name, type, config) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (type) {
            case "sql":
            case "mysql":
            case "mysqli":
                queries[name] = sql_1.default;
                break;
            case "pg":
            case "postgres":
            case "postgresql":
                queries[name] = sql_2.default;
                break;
        }
        if (config) {
            yield queries[name].toggleSettings(config);
        }
        return queries[name];
    });
}
exports.addQuery = addQuery;
function setDefault(name, config) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield addQuery("default", name, config);
    });
}
exports.setDefault = setDefault;
// -------------------------------------------------
// Exports
// -------------------------------------------------
// Base abstract query
var builder_1 = require("./abstractions/builder");
Object.defineProperty(exports, "AbstractQuery", { enumerable: true, get: function () { return builder_1.default; } });
// Implementations
var sql_3 = require("./classes/queryStrategies/sql");
Object.defineProperty(exports, "SqlQuery", { enumerable: true, get: function () { return sql_3.default; } });
// default query
exports.default = (key) => queries[key || "default"];
//# sourceMappingURL=index.js.map