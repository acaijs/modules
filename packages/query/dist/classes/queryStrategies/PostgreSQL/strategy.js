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
// Packages
const Client = require("pg");
// Helpers
const helpers_1 = require("./helpers");
class SqlStrategy {
    constructor() {
        // -------------------------------------------------
        // Properties
        // -------------------------------------------------
        this.client = {};
        this.migrations = {};
        this.connected = false;
    }
    // -------------------------------------------------
    // Client methods
    // -------------------------------------------------
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client && this.client.end)
                yield this.client.end();
        });
    }
    build(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.close();
            this.client = new Client.Client(settings);
            return new Promise(r => {
                this.client.connect((err) => {
                    this.errors = err;
                    this.connected = !err;
                    return r(err || false);
                });
            });
        });
    }
    isConnected() {
        return this.connected;
    }
    hasErrors() {
        return this.errors || false;
    }
    // -------------------------------------------------
    // Data methods
    // -------------------------------------------------
    raw(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield helpers_1.queryResolver(this.client, query);
        });
    }
    sum(table, column, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringcondition = condition && helpers_1.resolveQueryPart(condition);
            return yield helpers_1.queryResolver(this.client, `SELECT SUM(${column}) FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}` : ""}`);
        });
    }
    avg(table, column, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringcondition = condition && helpers_1.resolveQueryPart(condition);
            return yield helpers_1.queryResolver(this.client, `SELECT AVG(${column}) FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}` : ""}`);
        });
    }
    count(table, column, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringcondition = condition && helpers_1.resolveQueryPart(condition);
            return Object.values((yield helpers_1.queryResolver(this.client, `SELECT COUNT(${column}) FROM ${table}${stringcondition ? ` WHERE ${stringcondition[0]}` : ""}`))[0])[0];
        });
    }
    // -------------------------------------------------
    // Table methods
    // -------------------------------------------------
    existsTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (yield helpers_1.queryResolver(this.client, "SHOW TABLES"));
            return !!query.find(i => Object.values(i)[0] === table);
        });
    }
    getColumns(table) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (yield helpers_1.queryResolver(this.client, `SHOW CREATE TABLE ${table}`));
            if (query.length === 0)
                return {};
            return helpers_1.tableDeserialize(query[0]["Create Table"]);
        });
    }
    createTable(table, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = Object.keys(fields).find(k => fields[k].primary);
            const columns = [];
            const foreign = [];
            // build columns
            Object.keys(fields).map(key => {
                const column = helpers_1.columnSerialize(key, fields[key]);
                columns.push(column[0]);
                if (column[1])
                    foreign.push(column[1]);
            });
            yield helpers_1.queryResolver(this.client, `CREATE TABLE ${table} (${columns.join(", ")}${key ? `,PRIMARY KEY (${key})` : ""}${foreign.length > 0 ? `, ${foreign.join(", ")}` : ""})`);
            return true;
        });
    }
    alterTable(table, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = Object.keys(fields).find(k => fields[k].primary);
            const columns = [];
            const foreign = [];
            // build columns
            Object.keys(fields).map(key => {
                const column = helpers_1.columnSerialize(key, fields[key]);
                const type = fields[key].action === "ALTER" ? "MODIFY COLUMN" : fields[key].action === "DELETE" ? "DROP COLUMN" : "ADD";
                if (type === "DROP COLUMN")
                    columns.push(`${type} ${key}`);
                else
                    columns.push(`${type} ${column[0]}${fields[key].before ? ` BEFORE ${fields[key].before}` : ""}${fields[key].after ? ` AFTER ${fields[key].after}` : ""}`);
                if (column[1])
                    foreign.push(column[1]);
            });
            yield helpers_1.queryResolver(this.client, `ALTER TABLE ${table} (${columns.join(", ")}${key ? `,PRIMARY KEY (${key})` : ""}${foreign.length > 0 ? `, ${foreign.join(", ")}` : ""})`);
            return true;
        });
    }
    dropTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.queryResolver(this.client, `DROP TABLE IF EXISTS ${table}`);
            return true;
        });
    }
    // -------------------------------------------------
    // migration methods
    // -------------------------------------------------
    addMigration(table, columns) {
        this.migrations[table] = columns;
    }
    runMigrations() {
        return __awaiter(this, void 0, void 0, function* () {
            // data
            const columns = [];
            const constraints = [];
            // gather all migrations
            yield Promise.all(Object.keys(this.migrations).map(tableName => {
                const c = () => __awaiter(this, void 0, void 0, function* () {
                    const updatedtable = this.migrations[tableName];
                    // update table
                    if (yield this.existsTable(tableName)) {
                        const oldtable = yield this.getColumns(tableName);
                        const [_columns, _constraints] = helpers_1.smartUpdate(tableName, oldtable, updatedtable);
                        columns.push(_columns);
                        constraints.push(_constraints);
                    }
                    // create table
                    else {
                        const key = Object.keys(updatedtable).find(k => updatedtable[k].primary);
                        const _columns = [];
                        const foreign = [];
                        Object.keys(updatedtable).map(key => {
                            const column = helpers_1.columnSerialize(key, updatedtable[key]);
                            _columns.push(column[0]);
                            if (column[1])
                                foreign.push(column[1]);
                        });
                        columns.push(`CREATE TABLE ${tableName} (${_columns.join(", ")}${key ? `,PRIMARY KEY (${key})` : ""})`);
                        constraints.push(`ALTER TABLE ${tableName} ${foreign.map(i => `ADD ${i}`).join(", ")}`);
                    }
                });
                return c();
            }));
            // run migrations
            for (let i = 0; i < columns.length; i++) {
                if (columns[i])
                    yield helpers_1.queryResolver(this.client, columns[i]);
            }
            for (let i = 0; i < constraints.length; i++) {
                if (constraints[i])
                    yield helpers_1.queryResolver(this.client, constraints[i]);
            }
            // dump all the tables after finishing
            this.migrations = {};
        });
    }
    // -------------------------------------------------
    // Transact methods
    // -------------------------------------------------
    startTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.queryResolver(this.client, "START TRANSACTION");
        });
    }
    savepointTransaction(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.queryResolver(this.client, `SAVEPOINT ${name}`);
        });
    }
    releaseTransaction(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.queryResolver(this.client, `RELEASE SAVEPOINT ${name}`);
        });
    }
    rollbackTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.queryResolver(this.client, "ROLLBACK");
        });
    }
    commitTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield helpers_1.queryResolver(this.client, "COMMIT");
        });
    }
    // -------------------------------------------------
    // CRUD methods
    // -------------------------------------------------
    querySelect(table, fields, condition, limit, offset, orderBy, joinClause, groupBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringcondition = condition && helpers_1.resolveQueryPart(condition);
            return yield helpers_1.queryResolver(this.client, `SELECT ${(fields && fields.length > 0) ? fields.join(", ") : "*"} FROM ${table}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}` : ""}${groupBy ? ` GROUP BY ${groupBy}` : ""}${orderBy ? ` ORDER BY ${orderBy.by} ${orderBy.order || "ASC"}` : ""}${limit ? ` LIMIT ${limit}` : ""}${offset ? ` OFFSET ${offset}` : ""}${joinClause ? helpers_1.joinClauseBuilder(joinClause) : ""}`, stringcondition && stringcondition[1]);
        });
    }
    queryAdd(table, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield helpers_1.queryResolver(this.client, `INSERT INTO ${table}(${Object.keys(fields).join(", ")}) VALUES (${Object.values(fields).map(() => "?").join(", ")})`, Object.values(fields));
            return response.insertId;
        });
    }
    queryUpdate(table, fields, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = Object.keys(fields).map((key) => `${key} = ?`);
            const stringcondition = condition && helpers_1.resolveQueryPart(condition);
            const query = yield helpers_1.queryResolver(this.client, `UPDATE ${table} SET ${values}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}` : ""}`, [...Object.values(fields), ...((stringcondition && stringcondition[1]) || [])]);
            return query.affectedRows;
        });
    }
    queryDelete(table, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringcondition = condition && helpers_1.resolveQueryPart(condition);
            const query = yield helpers_1.queryResolver(this.client, `DELETE FROM ${table}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}` : ""}`, (stringcondition && stringcondition[1]));
            return query;
        });
    }
}
exports.default = SqlStrategy;
//# sourceMappingURL=strategy.js.map