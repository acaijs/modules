"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const isEquals_1 = require("../../../../utils/isEquals");
// Parts
const columnSerialize_1 = require("./columnSerialize");
// -------------------------------------------------
// calculate columns
// -------------------------------------------------
function calculateColumns(oldColumns, updatedColumns) {
    const responseColumns = [];
    // columns to add
    Object.keys(updatedColumns).forEach((key, index) => {
        if (!oldColumns[key]) {
            const response = [];
            const column = updatedColumns[key];
            // column action to insert
            response.push("ADD");
            // column information
            response.push(columnSerialize_1.default(key, column)[0]);
            // column position
            response.push(index === 0 ? "FIRST" : `AFTER ${Object.keys(updatedColumns)[index - 1]}`);
            responseColumns.push(response.join(" "));
        }
    });
    // columns to delete
    Object.keys(oldColumns).forEach(key => {
        if (!updatedColumns[key]) {
            const response = [];
            // column action to delete
            response.push("DROP COLUMN");
            // column name
            response.push(key);
            responseColumns.push(response.join(" "));
        }
    });
    // columns to update
    Object.keys(updatedColumns).forEach(key => {
        if (oldColumns[key]) {
            // diffs
            const _a = oldColumns[key], { foreign: _1, primary: _3 } = _a, oldData = __rest(_a, ["foreign", "primary"]);
            const _b = updatedColumns[key], { foreign: _2, primary: _4 } = _b, newData = __rest(_b, ["foreign", "primary"]);
            // positioning
            const fpos = Object.keys(oldColumns).indexOf(key);
            const spos = Object.keys(updatedColumns).indexOf(key);
            const pos = spos === 0 ? "FIRST" : `AFTER ${Object.keys(updatedColumns)[spos - 1]}`;
            if (!isEquals_1.default(oldData, newData) || fpos !== spos) {
                const response = [];
                const column = updatedColumns[key];
                // drop index if not present anymore
                if (oldData.unique && !newData.unique)
                    response.push(`DROP INDEX ${key},`);
                // column action to insert
                response.push("MODIFY COLUMN");
                // column information
                response.push(columnSerialize_1.default(key, column)[0]);
                // column position
                if (fpos !== spos && spos + 1 !== Object.keys(updatedColumns).length)
                    response.push(pos);
                responseColumns.push(response.join(" "));
            }
        }
    });
    // update primary key
    const oldkey = Object.keys(oldColumns).find(i => oldColumns[i].primary);
    const newkey = Object.keys(updatedColumns).find(i => updatedColumns[i].primary);
    if (oldkey && newkey && oldkey !== newkey)
        responseColumns.push(`DROP PRIMARY KEY, ADD PRIMARY KEY (${newkey})`);
    else if (oldkey && !newkey)
        responseColumns.push("DROP PRIMARY KEY");
    else if (!oldkey && newkey)
        responseColumns.push(`ADD PRIMARY KEY (${newkey})`);
    return responseColumns;
}
// -------------------------------------------------
// calculate constraints
// -------------------------------------------------
function calculateConstraints(oldColumns, updatedColumns) {
    const queryPart = [];
    // constraints to add
    Object.keys(updatedColumns).forEach(key => {
        if (updatedColumns[key].foreign && !oldColumns[key].foreign) {
            const column = updatedColumns[key];
            const foreign = column.foreign;
            const response = [];
            // action
            response.push("ADD");
            // custom defined name
            if (foreign.name)
                response.push(`CONSTRAINT ${foreign.name}`);
            // table column responsible for the constraint
            response.push(`FOREIGN KEY (${key})`);
            // table that is referenced
            response.push(`REFERENCES ${foreign.table}`);
            // primary key of the table
            response.push(`(${foreign.column || "id"})`);
            // on update event
            if (foreign.onUpdate)
                response.push(`ON UPDATE '${foreign.onUpdate}'`);
            // on delete event
            if (foreign.onDelete)
                response.push(`ON DELETE '${foreign.onDelete}'`);
            queryPart.push(response.join(" "));
        }
    });
    // constraints to delete
    Object.keys(oldColumns).forEach(key => {
        var _a;
        if (!updatedColumns[key].foreign && oldColumns[key].foreign) {
            queryPart.push(`DROP FOREIGN KEY ${(_a = oldColumns[key].foreign) === null || _a === void 0 ? void 0 : _a.name}`);
        }
    });
    // constraints to update
    Object.keys(updatedColumns).forEach(key => {
        var _a;
        if (updatedColumns[key].foreign && oldColumns[key].foreign && !isEquals_1.default(updatedColumns[key].foreign, oldColumns[key].foreign)) {
            const column = updatedColumns[key];
            const foreign = column.foreign;
            const response = [];
            // remove previous
            response.push(`DROP FOREIGN KEY ${(_a = oldColumns[key].foreign) === null || _a === void 0 ? void 0 : _a.name},`);
            // action
            response.push("ADD");
            // custom defined name
            if (foreign.name)
                response.push(`CONSTRAINT ${foreign.name}`);
            // table column responsible for the constraint
            response.push(`FOREIGN KEY (${key})`);
            // table that is referenced
            response.push(`REFERENCES ${foreign.table}`);
            // primary key of the table
            response.push(`(${foreign.column || "id"})`);
            // on update event
            if (foreign.onUpdate)
                response.push(`ON UPDATE '${foreign.onUpdate}'`);
            // on delete event
            if (foreign.onDelete)
                response.push(`ON DELETE '${foreign.onDelete}'`);
            queryPart.push(response.join(" "));
        }
    });
    return queryPart;
}
// -------------------------------------------------
// main method
// -------------------------------------------------
function smartUpdate(tableName, oldColumns, updatedColumns) {
    const columns = calculateColumns(oldColumns, updatedColumns);
    const constraints = calculateConstraints(oldColumns, updatedColumns);
    // build columns
    const columnQuery = columns.length > 0 ? `ALTER TABLE ${tableName} ${columns.filter(i => !!i.trim()).join(", ")}` : "";
    // build constraints
    const constraintQuery = constraints.length === 0 ? "" : `ALTER TABLE ${tableName} ${constraints.join(", ")}`;
    return [columnQuery.trim().replace(/ +(?= )/g, ""), constraintQuery.trim().replace(/ +(?= )/g, "")];
}
exports.default = smartUpdate;
//# sourceMappingURL=smartUpdate.js.map