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
function adapterColumnRelationTests(name, adapter, settings) {
    testing_1.default.group(`Test ${name} column relation methods`, (context) => {
        // -------------------------------------------------
        // setup
        // -------------------------------------------------
        context.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.toggleSettings(settings);
        }));
        context.afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").dropTable();
            yield adapter.table("base").dropTable();
        }));
        // -------------------------------------------------
        // tests
        // -------------------------------------------------
        testing_1.default("Test field basic constraint", (assert) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield adapter.table("base").createTable({
                id: {
                    type: "int",
                    primary: true,
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
            const table = yield adapter.table("test").getColumns();
            assert(table.id_base.foreign).toBeDefined();
            assert((_a = table.id_base.foreign) === null || _a === void 0 ? void 0 : _a.table).toBe("base");
            assert((_b = table.id_base.foreign) === null || _b === void 0 ? void 0 : _b.column).toBe("id");
        }));
        testing_1.default("Test field foreign key cascade on delete", (assert) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d, _e;
            yield adapter.table("base").createTable({
                id: {
                    type: "int",
                    primary: true,
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
                        onDelete: "CASCADE"
                    }
                }
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.id_base.foreign).toBeDefined();
            assert((_c = table.id_base.foreign) === null || _c === void 0 ? void 0 : _c.table).toBe("base");
            assert((_d = table.id_base.foreign) === null || _d === void 0 ? void 0 : _d.column).toBe("id");
            assert((_e = table.id_base.foreign) === null || _e === void 0 ? void 0 : _e.onDelete).toBe("CASCADE");
        }));
        testing_1.default("Test field foreign key cascade on update", (assert) => __awaiter(this, void 0, void 0, function* () {
            var _f, _g, _h;
            yield adapter.table("base").createTable({
                id: {
                    type: "int",
                    primary: true,
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
                        onUpdate: "CASCADE"
                    }
                }
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.id_base.foreign).toBeDefined();
            assert((_f = table.id_base.foreign) === null || _f === void 0 ? void 0 : _f.table).toBe("base");
            assert((_g = table.id_base.foreign) === null || _g === void 0 ? void 0 : _g.column).toBe("id");
            assert((_h = table.id_base.foreign) === null || _h === void 0 ? void 0 : _h.onUpdate).toBe("CASCADE");
        }));
        testing_1.default("Test field foreign key cascade on update and delete", (assert) => __awaiter(this, void 0, void 0, function* () {
            var _j, _k, _l, _m;
            yield adapter.table("base").createTable({
                id: {
                    type: "int",
                    primary: true,
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
                        onUpdate: "CASCADE",
                        onDelete: "CASCADE",
                    }
                }
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.id_base.foreign).toBeDefined();
            assert((_j = table.id_base.foreign) === null || _j === void 0 ? void 0 : _j.table).toBe("base");
            assert((_k = table.id_base.foreign) === null || _k === void 0 ? void 0 : _k.column).toBe("id");
            assert((_l = table.id_base.foreign) === null || _l === void 0 ? void 0 : _l.onUpdate).toBe("CASCADE");
            assert((_m = table.id_base.foreign) === null || _m === void 0 ? void 0 : _m.onDelete).toBe("CASCADE");
        }));
    }).tag(["column", "relation"]);
}
exports.default = adapterColumnRelationTests;
//# sourceMappingURL=column.relation.js.map