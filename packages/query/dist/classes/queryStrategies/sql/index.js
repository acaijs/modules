"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Abstractions
const index_1 = require("../../../abstractions/builder/index");
// Strategy
const strategy_1 = require("./strategy");
class SqlQuery extends index_1.default {
}
exports.default = SqlQuery;
SqlQuery.adapter = new strategy_1.default();
//# sourceMappingURL=index.js.map