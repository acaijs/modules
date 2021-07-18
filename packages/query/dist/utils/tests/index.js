"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const testing_1 = require("@acai/testing");
// Methods
const get_1 = require("./get");
const column_1 = require("./column");
const delete_1 = require("./delete");
const insert_1 = require("./insert");
const update_1 = require("./update");
const connection_1 = require("./connection");
const column_relation_1 = require("./column.relation");
const relation_update_1 = require("./relation.update");
function testAdapter(name, adapter, settings) {
    testing_1.default.group(`${name} tests`, () => {
        get_1.default(name, adapter, settings);
        column_1.default(name, adapter, settings);
        delete_1.default(name, adapter, settings);
        insert_1.default(name, adapter, settings);
        update_1.default(name, adapter, settings);
        connection_1.default(name, adapter, settings);
        column_relation_1.default(name, adapter, settings);
        relation_update_1.default(name, adapter, settings);
    });
}
exports.default = testAdapter;
//# sourceMappingURL=index.js.map