"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const router_1 = require("@acai/router");
const testing_1 = require("@acai/testing");
const request_1 = require("./utils/request");
const index_1 = require("../index");
testing_1.default.group("Server body request tests", (group) => {
    let server;
    group.afterEach(async () => { if (server)
        await server.stop(); });
    group.afterEach(router_1.route.clear);
    testing_1.default.group("JSON requests", () => {
        testing_1.default("correctly get fields from post", async (expect) => {
            let fields;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                return request.fields;
            });
            await server.run();
            await request_1.default.post("/").send({ field1: true, field2: "test" });
            expect(type).toBe("application/json");
            expect(fields).toBe({ field1: true, field2: "test" });
        });
        testing_1.default("correctly get fields from patch", async (expect) => {
            let fields;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                return request.fields;
            });
            await server.run();
            await request_1.default.post("/").send({ field1: true, field2: "test" });
            expect(type).toBe("application/json");
            expect(fields).toBe({ field1: true, field2: "test" });
        });
        testing_1.default("correctly get fields from put", async (expect) => {
            let fields;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                return request.fields;
            });
            await server.run();
            await request_1.default.post("/").send({ field1: true, field2: "test" });
            expect(type).toBe("application/json");
            expect(fields).toBe({ field1: true, field2: "test" });
        });
    });
    testing_1.default.group("FormData requests", () => {
        testing_1.default("correctly get fields from post", async (expect) => {
            let fields;
            let files;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                files = request.files;
                return request.fields;
            });
            await server.run();
            await request_1.default.post("/")
                .field({ field1: "true", field2: "test" })
                .attach("file", path.join(process.cwd(), "src/tests/utils/file.txt"));
            expect(fields).toBe({ field1: "true", field2: "test" });
            expect(files).toBeDefined();
            expect(type).toContain("multipart/form-data");
        });
        testing_1.default("correctly get fields from patch", async (expect) => {
            let fields;
            let files;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                files = request.files;
                return request.fields;
            });
            await server.run();
            await request_1.default.patch("/")
                .field({ field1: "true", field2: "test" })
                .attach("file", path.join(process.cwd(), "src/tests/utils/file.txt"));
            expect(fields).toBe({ field1: "true", field2: "test" });
            expect(files).toBeDefined();
            expect(type).toContain("multipart/form-data");
        });
        testing_1.default("correctly get fields from put", async (expect) => {
            let fields;
            let files;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                files = request.files;
                return request.fields;
            });
            await server.run();
            await request_1.default.put("/")
                .field({ field1: "true", field2: "test" })
                .attach("file", path.join(process.cwd(), "src/tests/utils/file.txt"));
            expect(fields).toBe({ field1: "true", field2: "test" });
            expect(files).toBeDefined();
            expect(type).toContain("multipart/form-data");
        });
    });
    testing_1.default.group("URL encoded requests", () => {
        testing_1.default("correctly get fields from post", async (expect) => {
            let fields;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                return request.fields;
            });
            await server.run();
            await request_1.default.post("/").type("form").send({ field1: true, field2: "test" });
            expect(fields).toBe({ field1: "true", field2: "test" });
            expect(type).toBe("application/x-www-form-urlencoded");
        });
        testing_1.default("correctly get fields from patch", async (expect) => {
            let fields;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                return request.fields;
            });
            await server.run();
            await request_1.default.post("/").type("form").send({ field1: true, field2: "test" });
            expect(fields).toBe({ field1: "true", field2: "test" });
            expect(type).toBe("application/x-www-form-urlencoded");
        });
        testing_1.default("correctly get fields from put", async (expect) => {
            let fields;
            let type;
            server = new index_1.default();
            router_1.route("/", "src/tests/utils/response.exception@test");
            server.addGlobal((request) => {
                type = request.headers["content-type"];
                fields = request.fields;
                return request.fields;
            });
            await server.run();
            await request_1.default.post("/").type("form").send({ field1: true, field2: "test" });
            expect(fields).toBe({ field1: "true", field2: "test" });
            expect(type).toBe("application/x-www-form-urlencoded");
        });
    });
}).tag(["server"]);
//# sourceMappingURL=body.test.js.map