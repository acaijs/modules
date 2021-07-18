"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Parts
const typeMaps_1 = require("./typeMaps");
function columnSerialize(key, data) {
    const length = data.length !== undefined ? data.length : ["string", "float", "int"].indexOf(data.type) + 1 > 0 ? 255 : undefined;
    const column = [];
    const constraint = [];
    // -------------------------------------------------
    // create column
    // -------------------------------------------------
    // column name
    column.push(key);
    // column type and length/enum args
    column.push(`${typeMaps_1.default[data.type].toLowerCase()}${length ? `(${length})` : ""}`);
    // column nullable
    column.push(data.nullable ? "NULL" : "NOT NULL");
    // column unique
    if (data.unique)
        column.push("UNIQUE");
    // column auto increment
    if (data.autoIncrement)
        column.push("AUTO_INCREMENT");
    // column default
    if (data.default)
        column.push(`DEFAULT ${(typeof data.default === "string" ? `'${data.default}'` : data.default)}`);
    // -------------------------------------------------
    // create constraint
    // -------------------------------------------------
    if (data.foreign) {
        // field name
        constraint.push(`FOREIGN KEY (${key})`);
        // foreign table
        constraint.push(`REFERENCES ${data.foreign.table}`);
        // foreign table primary key
        constraint.push(`(${data.foreign.column || "id"})`);
        // on update method
        if (data.foreign.onUpdate)
            constraint.push(`ON UPDATE ${data.foreign.onUpdate}`);
        // on delete method
        if (data.foreign.onDelete)
            constraint.push(`ON DELETE ${data.foreign.onDelete}`);
    }
    return [column.join(" "), constraint.join(" ") || undefined];
}
exports.default = columnSerialize;
//# sourceMappingURL=columnSerialize.js.map