"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@acai/router");
const testing_1 = require("@acai/testing");
const request_1 = require("./utils/request");
const index_1 = require("../index");
testing_1.default.group("Server body request tests", (group) => {
    let server;
    group.afterEach(async () => { if (server)
        await server.stop(); });
    group.afterEach(router_1.route.clear);
    testing_1.default("correctly send query params", async (expect) => {
        let fields;
        server = new index_1.default();
        router_1.route("/", "src/tests/utils/response.exception@test");
        server.addGlobal((request) => {
            fields = request.query;
            return request.fields;
        });
        await server.run();
        await request_1.default.get("/").query({ module: "server" });
        expect(fields).toBe({ module: "server" });
    });
    testing_1.default("decode from url properly", async (expect) => {
        let fields;
        server = new index_1.default();
        router_1.route("/", "src/tests/utils/response.exception@test");
        server.addGlobal((request) => {
            fields = request.query;
            return request.fields;
        });
        await server.run();
        await request_1.default.get("/").query({ module: "açaí" });
        expect(fields).toBe({ module: "açaí" });
    });
    testing_1.default("convert numbers from string to number", async (expect) => {
        let fields;
        server = new index_1.default();
        router_1.route("/", "src/tests/utils/response.exception@test");
        server.addGlobal((request) => {
            fields = request.query;
            return request.fields;
        });
        await server.run();
        await request_1.default.get("/").query({ version: 2 });
        expect(fields).toBe({ version: 2 });
    });
    testing_1.default("keys without values will turn into true booleans", async (expect) => {
        let fields;
        server = new index_1.default();
        router_1.route("/", "src/tests/utils/response.exception@test");
        server.addGlobal((request) => {
            fields = request.query;
            return request.fields;
        });
        await server.run();
        await request_1.default.get("/?accept");
        expect(fields).toBe({ accept: true });
    });
}).tag(["server"]);
//# sourceMappingURL=query.test.js.map