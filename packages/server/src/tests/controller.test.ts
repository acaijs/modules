// Packages
import { route }	from "@acai/router";
import test			from "@acai/testing";

// Utils
import request	from "./utils/request";

// Modules
import Server from "../index";

test.group("Server controller tests", (group) => {
	// general instance to be reused and dispatched
	let server: Server;

	// make sure no server instances are kept running after each test
	group.afterEach(async () => { if (server) await server.stop() });
	group.afterEach(route.clear);
	
	test("exceptions inside of a controller shouldn't crash the server", async (expect) => {
		server = new Server();

		// create routes
		route("/", "src/tests/utils/response.exception@test");

		await server.run();

		// make request
		const { text } = await request.get("");

		expect(text).toBe("Exception thrown");
	});

	test.group("Controller types", () => {
		test("correctly call the route when calling callback controller", async (expect) => {
			// create route to be called
			route("/", () => ({message: "success"}));
	
			// start server
			server = new Server();
			await server.run();
	
			// make request
			const { body } = await request.get("");
	
			expect(body).toBe({message: "success"});
		});
	
		test("correctly call the route when calling path class controller", async (expect) => {
			// create route to be called
			route("/", "src/tests/utils/response.class@test");
	
			// start server
			server = new Server();
			await server.run();
	
			// make request
			const { body } = await request.get("");
	
			expect(body).toBe({message: "success"});
		});
	
		test("correctly call the route when calling path callback controller", async (expect) => {
			// create route to be called
			route("/", "src/tests/utils/response.callback");
	
			// start server
			server = new Server();
			await server.run();
	
			// make request
			const { body } = await request.get("");
	
			expect(body).toBe({message: "success"});
		});
	
		test("correctly call the route when calling path object controller", async (expect) => {
			// create route to be called
			route("/", "src/tests/utils/response.object@test");
	
			// start server
			server = new Server();
			await server.run();
	
			// make request
			const { body } = await request.get("");
	
			expect(body).toBe({message: "success"});
		});
	});
}).tag(["server"]);