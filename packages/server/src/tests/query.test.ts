// Packages
import { route }	from "@acai/router";
import test			from "@acai/testing";

// Utils
import request	from "./utils/request";

// Modules
import Server from "../index";

test.group("Server body request tests", (group) => {
	// general instance to be reused and dispatched
	let server: Server;

	// make sure no server instances are kept running after each test
	group.afterEach(async () => { if (server) await server.stop() });
	group.afterEach(route.clear);
	
	test("correctly send query params", async (expect) => {
		let fields;
		server = new Server();

		// create routes
		route("/", "src/tests/utils/response.exception@test");

		server.addGlobal((request) => {
			fields = request.query;
			return request.fields;
		});

		await server.run();

		// make request
		await request.get("/").query({ module: "server" });

		expect(fields).toBe({ module: "server" });
	});
	
	test("decode from url properly", async (expect) => {
		let fields;
		server = new Server();

		// create routes
		route("/", "src/tests/utils/response.exception@test");

		server.addGlobal((request) => {
			fields = request.query;
			return request.fields;
		});

		await server.run();

		// make request
		await request.get("/").query({ module: "açaí" });

		expect(fields).toBe({ module: "açaí" });
	});
	
	test("convert numbers from string to number", async (expect) => {
		let fields;
		server = new Server();

		// create routes
		route("/", "src/tests/utils/response.exception@test");

		server.addGlobal((request) => {
			fields = request.query;
			return request.fields;
		});

		await server.run();

		// make request
		await request.get("/").query({ version: 2 });

		expect(fields).toBe({ version: 2 });
	});
	
	test("keys without values will turn into true booleans", async (expect) => {
		let fields;
		server = new Server();

		// create routes
		route("/", "src/tests/utils/response.exception@test");

		server.addGlobal((request) => {
			fields = request.query;
			return request.fields;
		});

		await server.run();

		// make request
		await request.get("/?accept");

		expect(fields).toBe({ accept: true });
	});
}).tag(["server"]);