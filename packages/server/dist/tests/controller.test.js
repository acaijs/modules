"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@acai/router");
const testing_1 = require("@acai/testing");
const request_1 = require("./utils/request");
const index_1 = require("../index");
testing_1.default.group("Server controller tests", (group) => {
    let server;
    group.afterEach(async () => { if (server)
        await server.stop(); });
    group.afterEach(router_1.route.clear);
    testing_1.default("exceptions inside of a controller shouldn't crash the server", async (expect) => {
        server = new index_1.default();
        router_1.route("/", "src/tests/utils/response.exception@test");
        await server.run();
        const { text } = await request_1.default.get("");
        expect(text).toBe("Exception thrown");
    });
    testing_1.default.group("Controller types", () => {
        testing_1.default("correctly call the route when calling callback controller", async (expect) => {
            router_1.route("/", () => ({ message: "success" }));
            server = new index_1.default();
            await server.run();
            const { body } = await request_1.default.get("");
            expect(body).toBe({ message: "success" });
        });
        testing_1.default("correctly call the route when calling path class controller", async (expect) => {
            router_1.route("/", "src/tests/utils/response.class@test");
            server = new index_1.default();
            await server.run();
            const { body } = await request_1.default.get("");
            expect(body).toBe({ message: "success" });
        });
        testing_1.default("correctly call the route when calling path callback controller", async (expect) => {
            router_1.route("/", "src/tests/utils/response.callback");
            server = new index_1.default();
            await server.run();
            const { body } = await request_1.default.get("");
            expect(body).toBe({ message: "success" });
        });
        testing_1.default("correctly call the route when calling path object controller", async (expect) => {
            router_1.route("/", "src/tests/utils/response.object@test");
            server = new index_1.default();
            await server.run();
            const { body } = await request_1.default.get("");
            expect(body).toBe({ message: "success" });
        });
    });
}).tag(["server"]);
//# sourceMappingURL=controller.test.js.map