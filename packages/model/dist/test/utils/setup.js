"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("@acai/query");
async function setup() {
    await query_1.setDefault("sql", {
        user: "root",
        password: "",
        database: "acai_query",
        host: "127.0.0.1",
        port: 3306,
    });
    console.clear();
    console.log("connection to database made");
}
exports.default = setup;
//# sourceMappingURL=setup.js.map