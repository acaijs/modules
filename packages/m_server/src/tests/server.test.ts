// Packages
import { route }	from "@acai/router"
import test			from "@acai/testing"

// Utils
import request			from "./utils/request"

// Modules
import Server from "../index"

test.group("Server general tests", (group) => {
	// general instance to be reused and dispatched
	let server: Server

	// make sure no server instances are kept running after each test
	group.afterEach(async () => { if (server) await server.stop() })
	group.afterEach(route.clear)

	test("make sure a server instance won't crash", async (expect) => {
		server = new Server()
		await server.run()

		expect(server).toBeDefined().cache()
	})

	test("globals must run before local middlewares", async (expect) => {
		let called = 1

		// create route to be called
		route.options({ middleware: ["test"] }, () => {
			route("/", "src/tests/utils/response.callback")
		})

		// start server
		server = new Server()

		// add test middleware
		server.addGlobal((request, next) => {
			called = 1
			return next(request)
		})

		server.addMiddleware("test", (request, next) => {
			called = 2
			return next(request)
		})

		await server.run()

		// make request
		await request.get("")

		expect(called).toBe(2)
	})
}).tag(["server"])