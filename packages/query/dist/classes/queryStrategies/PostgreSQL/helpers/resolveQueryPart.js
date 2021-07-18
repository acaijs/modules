"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resolveQueryPart(queryBuild) {
    const values = [];
    const parts = queryBuild.logic.map((item) => {
        const subparts = item.logic.map((subitem) => {
            if (subitem.type) {
                return `(${resolveQueryPart(subitem)})`;
            }
            const arrayitem = subitem;
            values.push(arrayitem[2]);
            return `${arrayitem[0]} ${arrayitem[1]} ?`;
        });
        return subparts.join(` ${item.type === "and" ? "AND" : "OR"} `);
    });
    return [parts.join(` ${queryBuild.type === "and" ? "AND" : "OR"} `), values];
}
exports.default = resolveQueryPart;
//# sourceMappingURL=resolveQueryPart.js.map