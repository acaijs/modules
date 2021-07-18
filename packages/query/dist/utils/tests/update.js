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
function adapterUpdateTests(name, adapter, settings) {
    testing_1.default.group(`Test ${name} update query methods`, (context) => {
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
        // tests
        // -------------------------------------------------
        testing_1.default("Test single update", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").where("id", 1).update({
                label: "Joe Doe",
            });
            const response = yield adapter.table("test").where("id", 1).first();
            assert(response === null || response === void 0 ? void 0 : response.label).toBe("Joe Doe");
        }));
        testing_1.default("Test multiple update", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").where("id", 1).orWhere("id", 2).update({
                description: "multiple update test",
            });
            const response = yield adapter.table("test").where("id", 1).orWhere("id", 2).get();
            assert(response.length).toBe(2);
            assert(response[0].description).toBe("multiple update test");
            assert(response[1].description).toBe("multiple update test");
        }));
        testing_1.default("Test update without where", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").update({
                description: "all update test",
            });
            const response = yield adapter.table("test").get();
            assert(response.length).toBe(3);
            assert(response[0].description).toBe("all update test");
            assert(response[1].description).toBe("all update test");
            assert(response[2].description).toBe("all update test");
        }));
    }).tag("update");
}
exports.default = adapterUpdateTests;
//# sourceMappingURL=update.js.map