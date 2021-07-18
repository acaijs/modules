"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Properties {
    constructor() {
        // -------------------------------------------------
        // properties
        // -------------------------------------------------
        this.tableName = "";
        this.queryBuild = { type: "or", logic: [] };
        this.fieldsList = [];
        // -------------------------------------------------
        // debug methods
        // -------------------------------------------------
        this.rawQueryObject = () => {
            return this.queryBuild;
        };
        this.buildQueryPart = (arg1, arg2, arg3) => {
            if (typeof arg1 === "string") {
                if (arg3) {
                    return [[arg1, arg2, arg3]];
                }
                else {
                    return [[arg1, "=", arg2]];
                }
            }
            return arg1.reduce((prev, item) => {
                const items = this.buildQueryPart(...item);
                items.forEach((v) => prev.push(v));
                return prev;
            }, []);
        };
    }
    // -------------------------------------------------
    // helper methods
    // -------------------------------------------------
    getAdapter() {
        return this.constructor.adapter;
    }
    push(type, subqueries) {
        if (this.queryBuild.logic.length !== 0 && this.queryBuild.type !== type) {
            for (let i = 0; i < subqueries.length; i++) {
                this.queryBuild.logic[this.queryBuild.logic.length - 1].logic.push(subqueries[i]);
            }
        }
        else {
            this.queryBuild.logic.push({
                type: "and",
                logic: subqueries,
            });
        }
    }
}
exports.default = Properties;
//# sourceMappingURL=properties.js.map