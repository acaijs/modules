"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Parts
const data_1 = require("./data");
class JoinClass extends data_1.default {
    // -------------------------------------------------
    // join methods
    // -------------------------------------------------
    joinType(type, table, firstColumn, secondColumnOrOperator, secondColumn) {
        this.joinList = {
            type,
            table,
            firstColumn,
            secondColumn: secondColumn || secondColumnOrOperator,
            operator: secondColumn ? secondColumnOrOperator : "=",
        };
        return this;
    }
    join(table, firstColumn, secondColumnOrOperator, secondColumn) {
        this.joinType("outer", table, firstColumn, secondColumnOrOperator, secondColumn);
        return this;
    }
    leftJoin(table, firstColumn, secondColumnOrOperator, secondColumn) {
        this.joinType("left", table, firstColumn, secondColumnOrOperator, secondColumn);
        return this;
    }
    rightJoin(table, firstColumn, secondColumnOrOperator, secondColumn) {
        this.joinType("right", table, firstColumn, secondColumnOrOperator, secondColumn);
        return this;
    }
    innerJoin(table, firstColumn, secondColumnOrOperator, secondColumn) {
        this.joinType("inner", table, firstColumn, secondColumnOrOperator, secondColumn);
        return this;
    }
}
exports.default = JoinClass;
//# sourceMappingURL=join.js.map