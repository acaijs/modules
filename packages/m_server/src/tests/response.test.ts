// Packages
import { route }	from "@acai/router";
import test			from "@acai/testing";

// Utils
import request	from "./utils/request";

// Modules
import Server from "../index";
import response from "../modules/response";

test.group("Server body response tests", (group) => {
	// general instance to be reused and dispatched
	let server: Server;

	// make sure no server instances are kept running after each test
	group.afterEach(async () => { if (server) await server.stop() });
	group.afterEach(route.clear);

	test("correctly get json", async (expect) => {
		server = new Server();

		// create routes
		route("/", () => ({ field1: true, field2: "test" }));

		await server.run();

		// make request
		const { body, headers } = await request.get("");

		expect(body).toBe({ field1: true, field2: "test" });
		expect(headers["content-type"]).toBeDefined().toBe("application/json");
	});

	test("correctly get plaintext", async (expect) => {
		server = new Server();

		// create routes
		route("/", () => "text");

		await server.run();

		// make request
		const { text, headers } = await request.get("");

		expect(text).toBe("text");
		expect(headers["content-type"]).toBe("text/plain");
	});

	test("change response status", async (expect) => {
		server = new Server();

		// create routes
		route("/", () => response().status(207));

		await server.run();

		// make request
		const { status } = await request.get("");

		expect(status).toBe(207);
	});

	test("add response header", async (expect) => {
		server = new Server();

		// create routes
		route("/", () => response().headers({ "custom-header": "true" }));

		await server.run();

		// make request
		const { headers } = await request.get("");

		expect(headers["custom-header"]).toBeDefined().toBe("true");
	});
}).tag(["server"]);