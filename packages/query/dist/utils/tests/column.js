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
function adapterColumnTests(name, adapter, settings) {
    testing_1.default.group(`Test ${name} column methods`, (context) => {
        // -------------------------------------------------
        // setup
        // -------------------------------------------------
        context.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.toggleSettings(settings);
        }));
        context.afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").dropTable();
        }));
        // -------------------------------------------------
        // tests
        // -------------------------------------------------
        testing_1.default("Test create table", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").createTable({
                id: {
                    type: "int",
                    length: 36,
                    autoIncrement: true,
                    primary: true,
                },
                email: {
                    type: "string",
                    unique: true,
                    length: 50,
                },
                label: {
                    type: "string",
                },
                description: {
                    type: "string",
                    nullable: true,
                },
            });
            const table = yield adapter.table("test").getColumns();
            assert(table).toBeDefined();
            assert(table.id).toBeDefined();
            assert(table.email).toBeDefined();
            assert(table.label).toBeDefined();
            assert(table.description).toBeDefined();
        }));
        testing_1.default("Test field length", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").createTable({
                id: {
                    type: "int",
                    primary: true,
                },
                field: {
                    type: "string",
                    length: 36,
                },
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.field.length).toBe(36);
        }));
        testing_1.default("Test field auto increment", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").createTable({
                field: {
                    type: "int",
                    autoIncrement: true,
                    primary: true,
                },
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.field.autoIncrement).toBe(true);
        }));
        testing_1.default("Test field primary", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").createTable({
                field: {
                    type: "int",
                    primary: true,
                },
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.field.primary).toBe(true);
        }));
        testing_1.default("Test field unique", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").createTable({
                id: {
                    type: "int",
                    primary: true,
                },
                field: {
                    type: "int",
                    unique: true,
                },
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.field.unique).toBe(true);
        }));
        testing_1.default("Test field nullable", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").createTable({
                id: {
                    type: "int",
                    primary: true,
                },
                field: {
                    type: "int",
                    nullable: true,
                },
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.field.nullable).toBe(true);
        }));
        testing_1.default("Test field default value", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").createTable({
                id: {
                    type: "int",
                    primary: true,
                },
                field: {
                    type: "int",
                    default: 10,
                },
            });
            const table = yield adapter.table("test").getColumns();
            assert(table.field.default).toBe(10);
        }));
    }).tag(["column"]);
}
exports.default = adapterColumnTests;
//# sourceMappingURL=column.js.map