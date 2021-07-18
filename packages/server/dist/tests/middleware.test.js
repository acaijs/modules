"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@acai/router");
const testing_1 = require("@acai/testing");
const request_1 = require("./utils/request");
const exception_1 = require("./utils/exception");
const index_1 = require("../index");
testing_1.default.group("Server middleware tests", (group) => {
    let server;
    group.afterEach(async () => { if (server)
        await server.stop(); });
    group.afterEach(router_1.route.clear);
    testing_1.default("only call middleware if it's inside context", async (expect) => {
        const called = false;
        router_1.route.options({ middleware: [] }, () => {
            router_1.route("/", "src/tests/utils/response.callback");
        });
        server = new index_1.default();
        server.addMiddleware("test", (request, next) => {
            return next(request);
        });
        await server.run();
        await request_1.default.get("");
        expect(called).toBe(false);
    });
    testing_1.default("correctly call the middleware and keep it's flow", async (expect) => {
        let called = false;
        router_1.route.options({ middleware: ["test"] }, () => {
            router_1.route("/", "src/tests/utils/response.callback");
        });
        server = new index_1.default();
        server.addMiddleware("test", (request, next) => {
            called = true;
            return next(request);
        });
        await server.run();
        await request_1.default.get("");
        expect(called).toBe(true);
    });
    testing_1.default("correctly call the middleware and return from it", async (expect) => {
        router_1.route.options({ middleware: ["test"] }, () => {
            router_1.route("/", "src/tests/utils/response.callback");
        });
        server = new index_1.default();
        server.addMiddleware("test", () => {
            return { message: "middleware" };
        });
        await server.run();
        const { body } = await request_1.default.get("");
        expect(body).toBe({ message: "middleware" });
    });
    testing_1.default("call middlewares in the correct order", async (expect) => {
        let lastcalled = "";
        router_1.route.options({ middleware: ["test", "test2"] }, () => {
            router_1.route("/", "src/tests/utils/response.callback");
        });
        server = new index_1.default();
        server.addMiddleware("test", (r, n) => {
            lastcalled = "first";
            return n(r);
        });
        server.addMiddleware("test2", (r, n) => {
            lastcalled = "last";
            return n(r);
        });
        await server.run();
        await request_1.default.get("");
        expect(lastcalled).toBe("last");
    });
    testing_1.default("call middlewares in the correct order when nested", async (expect) => {
        let lastcalled = "";
        router_1.route.options({ middleware: ["test"] }, () => {
            router_1.route.options({ middleware: ["test2"] }, () => {
                router_1.route("/", "src/tests/utils/response.callback");
            });
        });
        server = new index_1.default();
        server.addMiddleware("test", (r, n) => {
            lastcalled = "first";
            return n(r);
        });
        server.addMiddleware("test2", (r, n) => {
            lastcalled = "last";
            return n(r);
        });
        await server.run();
        await request_1.default.get("");
        expect(lastcalled).toBe("last");
    });
    testing_1.default("exceptions inside of a middleware shouldn't crash the server", async (expect) => {
        server = new index_1.default();
        router_1.route.options({ middleware: ["test"] }, () => {
            router_1.route("/", () => ({}));
        });
        server.addMiddleware("test", () => {
            throw new exception_1.default("Exception thrown");
        });
        await server.run();
        const { text } = await request_1.default.get("");
        expect(text).toBe("Exception thrown");
    });
}).tag(["server"]);
//# sourceMappingURL=middleware.test.js.map