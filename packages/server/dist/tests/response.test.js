"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@acai/router");
const testing_1 = require("@acai/testing");
const request_1 = require("./utils/request");
const index_1 = require("../index");
const response_1 = require("../modules/response");
testing_1.default.group("Server body response tests", (group) => {
    let server;
    group.afterEach(async () => { if (server)
        await server.stop(); });
    group.afterEach(router_1.route.clear);
    testing_1.default("correctly get json", async (expect) => {
        server = new index_1.default();
        router_1.route("/", () => ({ field1: true, field2: "test" }));
        await server.run();
        const { body, headers } = await request_1.default.get("");
        expect(body).toBe({ field1: true, field2: "test" });
        expect(headers["content-type"]).toBeDefined().toBe("application/json");
    });
    testing_1.default("correctly get plaintext", async (expect) => {
        server = new index_1.default();
        router_1.route("/", () => "text");
        await server.run();
        const { text, headers } = await request_1.default.get("");
        expect(text).toBe("text");
        expect(headers["content-type"]).toBe("text/plain");
    });
    testing_1.default("change response status", async (expect) => {
        server = new index_1.default();
        router_1.route("/", () => response_1.default().status(207));
        await server.run();
        const { status } = await request_1.default.get("");
        expect(status).toBe(207);
    });
    testing_1.default("add response header", async (expect) => {
        server = new index_1.default();
        router_1.route("/", () => response_1.default().headers({ "custom-header": "true" }));
        await server.run();
        const { headers } = await request_1.default.get("");
        expect(headers["custom-header"]).toBeDefined().toBe("true");
    });
}).tag(["server"]);
//# sourceMappingURL=response.test.js.map