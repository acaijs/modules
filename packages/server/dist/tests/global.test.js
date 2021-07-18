"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@acai/router");
const testing_1 = require("@acai/testing");
const request_1 = require("./utils/request");
const exception_1 = require("./utils/exception");
const index_1 = require("../index");
testing_1.default.group("Server global middleware tests", (group) => {
    let server;
    group.afterEach(async () => { if (server)
        await server.stop(); });
    group.afterEach(router_1.route.clear);
    testing_1.default("correctly call the global and keep it's flow", async (expect) => {
        let called = false;
        router_1.route("/", "src/tests/utils/response.callback");
        server = new index_1.default();
        server.addGlobal((request, next) => {
            called = true;
            return next(request);
        });
        await server.run();
        await request_1.default.get("");
        expect(called).toBe(true);
    });
    testing_1.default("correctly call the global and return from it", async (expect) => {
        router_1.route("/", "src/tests/utils/response.callback");
        server = new index_1.default();
        server.addGlobal(() => {
            return { message: "middleware" };
        });
        await server.run();
        const { body } = await request_1.default.get("");
        expect(body).toBe({ message: "middleware" });
    });
    testing_1.default("call globals in the correct order", async (expect) => {
        let lastcalled = "";
        router_1.route("/", "src/tests/utils/response.callback");
        server = new index_1.default();
        server.addGlobal((r, n) => {
            lastcalled = "first";
            return n(r);
        });
        server.addGlobal((r, n) => {
            lastcalled = "last";
            return n(r);
        });
        await server.run();
        await request_1.default.get("");
        expect(lastcalled).toBe("last");
    });
    testing_1.default("exceptions inside of a global middleware shouldn't crash the server", async (expect) => {
        server = new index_1.default();
        router_1.route("/", () => ({}));
        server.addGlobal(() => {
            throw new exception_1.default("Exception thrown");
        });
        await server.run();
        const { text } = await request_1.default.get("");
        expect(text).toBe("Exception thrown");
    });
}).tag(["server"]);
//# sourceMappingURL=global.test.js.map