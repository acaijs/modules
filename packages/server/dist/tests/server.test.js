"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@acai/router");
const testing_1 = require("@acai/testing");
const request_1 = require("./utils/request");
const index_1 = require("../index");
testing_1.default.group("Server general tests", (group) => {
    let server;
    group.afterEach(async () => { if (server)
        await server.stop(); });
    group.afterEach(router_1.route.clear);
    testing_1.default("make sure a server instance won't crash", async (expect) => {
        server = new index_1.default();
        await server.run();
        expect(server).toBeDefined();
    });
    testing_1.default("globals must run before local middlewares", async (expect) => {
        let called = 1;
        router_1.route.options({ middleware: ["test"] }, () => {
            router_1.route("/", "src/tests/utils/response.callback");
        });
        server = new index_1.default();
        server.addGlobal((request, next) => {
            called = 1;
            return next(request);
        });
        server.addMiddleware("test", (request, next) => {
            called = 2;
            return next(request);
        });
        await server.run();
        await request_1.default.get("");
        expect(called).toBe(2);
    });
}).tag(["server"]);
//# sourceMappingURL=server.test.js.map