"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Parts
const typeMaps_1 = require("./typeMaps");
function tableDeserialize(tableString) {
    // const columnSt
    const columns = {};
    tableString.split("\n").splice(1).slice(0, -1).map(i => i.replace(/,$/g, "")).forEach(line => {
        const parts = line.split(" ").filter(i => i !== "");
        // columns
        if (parts[0].match(/^`.+`$/)) {
            const [type, length] = parts[1].split("(");
            const defaultValue = parts.find(i => i === "DEFAULT") ? parts[parts.indexOf("DEFAULT") + 1].replace(/(`|')/g, "") : undefined;
            columns[parts[0].replace(/`/g, "")] = {
                type: Object.keys(typeMaps_1.default).find(key => typeMaps_1.default[key] === type.toUpperCase()),
                length: length ? parseInt(length.replace(/(\(|\))/g, "")) : undefined,
                autoIncrement: !!parts.find(i => i === "AUTO_INCREMENT"),
                nullable: !parts.find((item, index) => item === "NOT" && parts[index + 1] && parts[index + 1] === "NULL"),
                default: !defaultValue || (defaultValue && defaultValue.match(/\D+/)) ? defaultValue : parseFloat(defaultValue),
            };
        }
        // foreign key
        else if (parts[0] === "CONSTRAINT") {
            const tableNameIndex = parts.indexOf("REFERENCES") + 1;
            columns[parts[4].replace(/(\(|\)|`|,)/g, "")].foreign = {
                name: parts[1].replace(/`/g, ""),
                table: parts[tableNameIndex].replace(/`/g, ""),
                column: parts[tableNameIndex + 1].replace(/(\(|\)|`|,)/g, ""),
                onUpdate: parts[parts.indexOf("UPDATE") - 1] === "ON" ? parts[parts.indexOf("UPDATE") + 1] : undefined,
                onDelete: parts[parts.indexOf("DELETE") - 1] === "ON" ? parts[parts.indexOf("DELETE") + 1] : undefined,
            };
        }
        // primary key
        else if (parts[0] === "PRIMARY") {
            columns[parts[2].replace(/(\(|\)|`|,)/g, "")].primary = true;
        }
        // unique key
        else if (parts[0] === "UNIQUE") {
            columns[parts[3].replace(/(\(|\)|`|,)/g, "")].unique = true;
        }
    });
    return columns;
}
exports.default = tableDeserialize;
//# sourceMappingURL=tableDeserialize.js.map