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
function adapterDeleteTests(name, adapter, settings) {
    testing_1.default.group(`Test ${name} delete query methods`, (context) => {
        // -------------------------------------------------
        // setup
        // -------------------------------------------------
        context.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            yield adapter.toggleSettings({
                user: "root",
                password: "",
                database: "acai_query",
            });
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
        testing_1.default("Test single delete", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").where("id", 1).delete();
            const response = yield adapter.table("test").where("id", 1).first();
            assert(response).toBeUndefined();
        }));
        testing_1.default("Test multiple delete", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").where("id", 1).orWhere("id", 2).delete();
            const response = yield adapter.table("test").where("id", 1).orWhere("id", 2).get();
            assert(response.length).toBe(0);
        }));
        testing_1.default("Test delete without where", (assert) => __awaiter(this, void 0, void 0, function* () {
            yield adapter.table("test").delete();
            const response = yield adapter.table("test").get();
            assert(response.length).toBe(0);
        }));
    }).tag("delete");
}
exports.default = adapterDeleteTests;
//# sourceMappingURL=delete.js.map