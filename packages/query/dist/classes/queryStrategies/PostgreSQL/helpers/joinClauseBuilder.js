"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types = {
    "inner": "INNER",
    "left": "LEFT",
    "right": "RIGHT",
    "outer": "FULL OUTER"
};
function joinClauseBuilder(joinClause) {
    const type = types[joinClause.type];
    return `${type} JOIN ${joinClause.table} ON ${joinClause.firstColumn}${joinClause.operator}${joinClause.secondColumn}`;
}
exports.default = joinClauseBuilder;
//# sourceMappingURL=joinClauseBuilder.js.map