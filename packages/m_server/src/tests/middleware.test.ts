// Packages
import { route }	from "@acai/router";
import test			from "@acai/testing";

// Utils
import request			from "./utils/request";
import TestException	from "./utils/exception";

// Modules
import Server from "../index";

test.group("Server middleware tests", (group) => {
	// general instance to be reused and dispatched
	let server: Server;

	// make sure no server instances are kept running after each test
	group.afterEach(async () => { if (server) await server.stop() });
	group.afterEach(route.clear);

	test("only call middleware if it's inside context", async (expect) => {
		const called = false;

		// create route to be called
		route.options({ middleware: [] }, () => {
			route("/", "src/tests/utils/response.callback");
		});

		// start server
		server = new Server();

		// add test middleware
		server.addMiddleware("test", (request, next) => {
			return next(request);
		});

		await server.run();

		// make request
		await request.get("");

		expect(called).toBe(false);
	});

	test("correctly call the middleware and keep it's flow", async (expect) => {
		let called = false;

		// create route to be called
		route.options({ middleware: ["test"] }, () => {
			route("/", "src/tests/utils/response.callback");
		});

		// start server
		server = new Server();

		// add test middleware
		server.addMiddleware("test", (request, next) => {
			called = true;
			return next(request);
		});

		await server.run();

		// make request
		await request.get("");

		expect(called).toBe(true);
	});

	test("correctly call the middleware and return from it", async (expect) => {
		// create route to be called
		route.options({ middleware: ["test"] }, () => {
			route("/", "src/tests/utils/response.callback");
		});

		// start server
		server = new Server();

		// add test middleware
		server.addMiddleware("test", () => {
			return { message: "middleware" };
		});

		await server.run();

		// make request
		const { body } = await request.get("");

		expect(body).toBe({message:"middleware"});
	});

	test("call middlewares in the correct order", async (expect) => {
		let lastcalled = "";

		// create route to be called
		route.options({ middleware: ["test", "test2"] }, () => {
			route("/", "src/tests/utils/response.callback");
		});

		// start server
		server = new Server();

		// add test middleware
		server.addMiddleware("test", (r, n) => {
			lastcalled = "first";
			return n(r);
		});

		server.addMiddleware("test2", (r, n) => {
			lastcalled = "last";
			return n(r);
		});

		await server.run();

		// make request
		await request.get("");

		expect(lastcalled).toBe("last");
	});

	test("call middlewares in the correct order when nested", async (expect) => {
		let lastcalled = "";

		// create route to be called
		route.options({ middleware: ["test"] }, () => {
			route.options({ middleware: ["test2"] }, () => {
				route("/", "src/tests/utils/response.callback");
			});
		});

		// start server
		server = new Server();

		// add test middleware
		server.addMiddleware("test", (r, n) => {
			lastcalled = "first";
			return n(r);
		});

		server.addMiddleware("test2", (r, n) => {
			lastcalled = "last";
			return n(r);
		});

		await server.run();

		// make request
		await request.get("");

		expect(lastcalled).toBe("last");
	});

	test("exceptions inside of a middleware shouldn't crash the server", async (expect) => {
		server = new Server();

		// create routes
		route.options({ middleware: ["test"] }, () => {
			route("/", () => ({}));
		});

		// add test middleware
		server.addMiddleware("test", () => {
			throw new TestException("Exception thrown");
		});

		await server.run();

		// make request
		const { text } = await request.get("");

		expect(text).toBe("Exception thrown");
	});
}).tag(["server"]);