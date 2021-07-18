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
const join_1 = require("./join");
class QueryClass extends join_1.default {
    constructor() {
        // -------------------------------------------------
        // query methods
        // -------------------------------------------------
        super(...arguments);
        this.table = (table) => {
            this.tableName = table;
            return this;
        };
        this.where = (arg1, arg2, arg3) => {
            const subqueries = this.buildQueryPart(arg1, arg2, arg3);
            this.push("and", subqueries);
            // return self for concatenation
            return this;
        };
        this.orWhere = (arg1, arg2, arg3) => {
            const subqueries = this.buildQueryPart(arg1, arg2, arg3);
            this.push("or", subqueries);
            // return self for concatenation
            return this;
        };
        this.whereNull = (field) => {
            this.push("and", [[field, "IS NULL"]]);
            // return self for concatenation
            return this;
        };
        this.whereNotNull = (field) => {
            this.push("and", [[field, "IS NOT NULL"]]);
            // return self for concatenation
            return this;
        };
        this.orWhereNull = (field) => {
            this.push("or", [[field, "IS NULL"]]);
            // return self for concatenation
            return this;
        };
        this.orWhereNotNull = (field) => {
            this.push("or", [[field, "IS NOT NULL"]]);
            // return self for concatenation
            return this;
        };
        this.whereIn = (field, values) => {
            this.push("and", [[field, "IN", values]]);
            // return self for concatenation
            return this;
        };
        this.whereNotIn = (field, values) => {
            this.push("and", [[field, "NOT IN", values]]);
            // return self for concatenation
            return this;
        };
        this.orWhereIn = (field, values) => {
            this.push("or", [[field, "IN", values]]);
            // return self for concatenation
            return this;
        };
        this.orWhereNotIn = (field, values) => {
            this.push("or", [[field, "NOT IN", values]]);
            // return self for concatenation
            return this;
        };
        this.orderBy = (by, order) => {
            this.orderByQuery = { order, by };
            return this;
        };
        this.limit = (quantity, offset) => {
            this.limitQuantity = quantity;
            if (offset)
                this.offsetQuantity = offset;
            return this;
        };
        this.groupBy = (column) => {
            this.groupByColumn = column;
            return this;
        };
        this.fields = (fields) => {
            this.fieldsList = fields;
            return this;
        };
        this.parseResult = (cb) => {
            this.parseResultCache = cb;
            return this;
        };
        // -------------------------------------------------
        // get methods
        // -------------------------------------------------
        this.first = () => __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.limit(1).get())[0];
            return result;
        });
        this.last = (fields = ["*"]) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.getAdapter().querySelect(this.tableName, fields, this.queryBuild.logic.length > 0 ? this.queryBuild : undefined, 1, 0, {
                order: "DESC",
                by: ((_a = this.orderByQuery) === null || _a === void 0 ? void 0 : _a.by) || "id",
            }, this.joinList)[0];
            return this.parseResultCache ? this.parseResultCache(result) : result;
        });
        this.get = (fields) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getAdapter().querySelect(this.tableName, fields || this.fieldsList, this.queryBuild.logic.length > 0 ? this.queryBuild : undefined, this.limitQuantity, this.offsetQuantity, this.orderByQuery, this.joinList);
            return this.parseResultCache ? this.parseResultCache(result) : result;
        });
        this.paginate = (page, perPage = 25) => __awaiter(this, void 0, void 0, function* () {
            const total = yield this.count();
            const npp = parseInt(perPage);
            const np = parseInt(page);
            const entries = yield this.getAdapter().querySelect(this.tableName, this.fieldsList, this.queryBuild.logic.length > 0 ? this.queryBuild : undefined, npp, ((np || 1) - 1) * npp, this.orderByQuery, this.joinList);
            return {
                data: (this.parseResultCache ? this.parseResultCache(entries) : entries.map(i => (Object.assign({}, i)))),
                page: np || 1,
                perPage: npp,
                totalItems: total,
                totalPages: Math.ceil(total / npp),
            };
        });
        // -------------------------------------------------
        // manipulation methods
        // -------------------------------------------------
        this.insert = (fields) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().queryAdd(this.tableName, fields);
        });
        this.insertMany = (rows) => __awaiter(this, void 0, void 0, function* () {
            return Promise.all(rows.map(row => this.insert(row)));
        });
        this.update = (fields) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().queryUpdate(this.tableName, fields, this.queryBuild);
        });
        this.updateMany = (rows) => __awaiter(this, void 0, void 0, function* () {
            return Promise.all(rows.map(row => this.update(row)));
        });
        this.delete = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdapter().queryDelete(this.tableName, this.queryBuild);
        });
    }
}
exports.default = QueryClass;
//# sourceMappingURL=query.js.map