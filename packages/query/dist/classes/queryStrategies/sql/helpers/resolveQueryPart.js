"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function valueType(value) {
    if (value === null || value === undefined)
        return "";
    if (Array.isArray(value))
        return " (?)";
    return " ?";
}
function resolveQueryPart(queryBuild) {
    const values = [];
    const parts = queryBuild.logic.map((item) => {
        const subparts = item.logic.map((subitem) => {
            if (subitem.type) {
                return `(${resolveQueryPart(subitem)})`;
            }
            const arrayitem = subitem;
            if (arrayitem[2] !== null && arrayitem[2] !== undefined)
                values.push(arrayitem[2]);
            return `${arrayitem[0]} ${arrayitem[1]}${valueType(arrayitem[2])}`;
        });
        return subparts.join(` ${item.type === "and" ? "AND" : "OR"} `);
    });
    return [parts.join(` ${queryBuild.type === "and" ? "AND" : "OR"} `), values];
}
exports.default = resolveQueryPart;
//# sourceMappingURL=resolveQueryPart.js.map