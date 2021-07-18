"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const testing_1 = require("@acai/testing");
function adapterRelationUpdateTests(name, adapter, settings) {
    testing_1.default.group(`Test ${name} column relation update methods`, (context) => {
        // -------------------------------------------------
        // setup
        // -------------------------------------------------
        context.beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.toggleSettings(settings);
            yield adapter.table("base").createTable({
                id: {
                    type: "int",
                    primary: true,
                },
            });
            yield adapter.table("base2").createTable({
                id: {
                    type: "int",
                    primary: true,
                },
                code: {
                    type: "int",
                    unique: true,
                },
            });
            yield adapter.table("test").createTable({
                id: {
                    type: "int",
                    primary: true,
                },
                id_base: {
                    type: "int",
                    foreign: {
                        table: "base",
                    }
                }
            });
        }));
        context.afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").dropTable();
            yield adapter.table("base").dropTable();
            yield adapter.table("base2").dropTable();
        }));
        // -------------------------------------------------
        // tests
        // -------------------------------------------------
        testing_1.default("Test field basic constraint name change", (assert) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            adapter.addMigration("test", {
                id: {
                    type: "int",
                    primary: true,
                },
                id_base: {
                    type: "int",
                    foreign: {
                        table: "base",
                        name: "customname"
                    }
                }
            });
            yield adapter.runMigrations();
            const table = yield adapter.table("test").getColumns();
            assert(table.id_base.foreign).toBeDefined();
            assert((_a = table.id_base.foreign) === null || _a === void 0 ? void 0 : _a.name).toBe("customname");
            assert((_b = table.id_base.foreign) === null || _b === void 0 ? void 0 : _b.table).toBe("base");
            assert((_c = table.id_base.foreign) === null || _c === void 0 ? void 0 : _c.column).toBe("id");
        }));
        testing_1.default("Test field basic constraint table change", (assert) => __awaiter(this, void 0, void 0, function* () {
            var _d, _e;
            adapter.addMigration("test", {
                id: {
                    type: "int",
                    primary: true,
                },
                id_base: {
                    type: "int",
                    foreign: {
                        table: "base2"
                    }
                }
            });
            yield adapter.runMigrations();
            const table = yield adapter.table("test").getColumns();
            assert(table.id_base.foreign).toBeDefined();
            assert((_d = table.id_base.foreign) === null || _d === void 0 ? void 0 : _d.table).toBe("base2");
            assert((_e = table.id_base.foreign) === null || _e === void 0 ? void 0 : _e.column).toBe("id");
        }));
        testing_1.default("Test field basic constraint column change", (assert) => __awaiter(this, void 0, void 0, function* () {
            var _f, _g;
            adapter.addMigration("test", {
                id: {
                    type: "int",
                    primary: true,
                },
                id_base: {
                    type: "int",
                    foreign: {
                        table: "base2",
                        column: "code"
                    }
                }
            });
            yield adapter.runMigrations();
            const table = yield adapter.table("test").getColumns();
            assert(table.id_base.foreign).toBeDefined();
            assert((_f = table.id_base.foreign) === null || _f === void 0 ? void 0 : _f.table).toBe("base2");
            assert((_g = table.id_base.foreign) === null || _g === void 0 ? void 0 : _g.column).toBe("code");
        }));
    }).tag(["column", "relation", "update"]);
}
exports.default = adapterRelationUpdateTests;
//# sourceMappingURL=relation.update.js.map