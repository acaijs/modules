"use strict";
// -------------------------------------------------
// Serialize column data
// -------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
const typeMaps = {
    string: "VARCHAR",
    text: "TEXT",
    int: "INT",
    float: "FLOAT",
    boolean: "TINYINT",
    date: "DATE",
    datetime: "DATETIME",
    timestamp: "TIMESTAMP",
    json: "JSON",
};
exports.default = typeMaps;
//# sourceMappingURL=typeMaps.js.map