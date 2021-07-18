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
function adapterGetTests(name, adapter, settings) {
    testing_1.default.group(`Test ${name} get query methods`, (context) => {
        // -------------------------------------------------
        // setup
        // -------------------------------------------------
        context.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.toggleSettings(settings);
        }));
        context.beforeEach(() => __awaiter(this, void 0, void 0, function* () {
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
            yield adapter.table("test").insert({ email: "john.doe@email.com", label: "John Doe" });
            yield adapter.table("test").insert({ email: "mary.doe@email.com", label: "Mary Doe" });
            yield adapter.table("test").insert({ email: "junior.doe@email.com", label: "Junior Doe", description: "Son of John and Mary Doe" });
        }));
        context.afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").dropTable();
        }));
        // -------------------------------------------------
        // tests - retrieval
        // -------------------------------------------------
        testing_1.default("Test simple get without where clause", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").get();
            assert(fields).toBeDefined();
            assert(fields.length).toBe(3);
        }));
        testing_1.default("Test simple get with one where clause", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").where("id", 1).get();
            assert(fields).toBeDefined();
            assert(fields.length).toBe(1);
        }));
        testing_1.default("Test get first without where clause", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").first();
            assert(fields).toBeDefined();
        }));
        testing_1.default("Test paginate without where clause", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").paginate();
            assert(fields).toBeDefined();
            assert(fields.page).toBe(1);
            assert(fields.perPage).toBe(25);
            assert(fields.totalItems).toBe(3);
            assert(fields.data.length).toBe(3);
        }));
        // -------------------------------------------------
        // tests - filters
        // -------------------------------------------------
        testing_1.default("Test limit query", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").limit(1).get();
            assert(fields).toBeDefined();
            assert(fields.length).toBe(1);
        }));
        testing_1.default("Test offset query", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").limit(3, 1).get();
            assert(fields).toBeDefined();
            assert(fields[0].id).toBe(2);
        }));
        testing_1.default("Test return all fields", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").fields(["*"]).first();
            assert(fields).toBeDefined();
            assert(fields === null || fields === void 0 ? void 0 : fields.id).toBeDefined();
            assert(fields === null || fields === void 0 ? void 0 : fields.email).toBeDefined();
            assert(fields === null || fields === void 0 ? void 0 : fields.label).toBeDefined();
        }));
        testing_1.default("Test return only one field", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").fields(["id"]).first();
            assert(fields).toBeDefined();
            assert(fields === null || fields === void 0 ? void 0 : fields.id).toBeDefined();
            assert(fields === null || fields === void 0 ? void 0 : fields.email).toBeUndefined();
            assert(fields === null || fields === void 0 ? void 0 : fields.label).toBeUndefined();
        }));
        testing_1.default("Test order by id asc", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").orderBy("id").get();
            assert(fields).toBeDefined();
            assert(fields.length).toBe(3);
            assert(fields[0].id).toBe(1);
            assert(fields[1].id).toBe(2);
            assert(fields[2].id).toBe(3);
        })).tag("order");
        testing_1.default("Test order by id desc", (assert) => __awaiter(this, void 0, void 0, function* () {
            const fields = yield adapter.table("test").orderBy("id", "DESC").get();
            assert(fields).toBeDefined();
            assert(fields.length).toBe(3);
            assert(fields[0].id).toBe(3);
            assert(fields[1].id).toBe(2);
            assert(fields[2].id).toBe(1);
        })).tag("order");
    }).tag("get");
}
exports.default = adapterGetTests;
//# sourceMappingURL=get.js.map