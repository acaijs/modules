// Packages
import { route } from "@acai/router/dist"
import test from "@acai/testing"

// Adapters
import HttpAdapter from "../adapters/http"

// Utils
import request from "./utils/request"

// Modules
import Server from "../modules/server"

test.group("Adapter tests", () => {
	test.group("HTTP", (group) => {
		// -------------------------------------------------
		// Setup
		// -------------------------------------------------

		group.beforeEach(route.clear)

		// -------------------------------------------------
		// Test 1
		// -------------------------------------------------

		test("Adapter correctly added to server", (assert) => {
			// arrange
			const server = new Server()

			// act
			server.addAdapter("test", HttpAdapter)
			const adapter = server.getAdapter("test")!

			// assert
			assert(adapter).toBeDefined()
			assert(adapter.adapter).toBeDefined()
			assert(adapter.adapter.boot).toBeDefined()
			assert(adapter.adapter.shutdown).toBeDefined()
			assert(adapter.adapter.onRequest).toBeDefined()
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Server correctly starts up", async (assert) => {
			// arrange
			const server = new Server()

			// act
			await server.run()
			await server.stop()

			// assert
			assert(server).toBeDefined()
		})

		// -------------------------------------------------
		// Test 3
		// -------------------------------------------------

		test("Requests correctly arrive to controller", async (assert) => {
			// arrange
			const data = { request: false }
			const server = new Server()
			route("/", () => data.request = true)

			// act
			await server.run()
			await request.get("/")
			await server.stop()

			// assert
			assert(data.request).toBe(true)
		})

		// -------------------------------------------------
		// Test 4
		// -------------------------------------------------

		test("Correctly call GET request", async (assert) => {
			// arrange
			const data = { request: false }
			const server = new Server()
			route.get("/", () => data.request = true)

			// act
			await server.run()
			await request.get("/")
			await server.stop()

			// assert
			assert(data.request).toBe(true)
		})

		// -------------------------------------------------
		// Test 5
		// -------------------------------------------------

		test("Correctly call POST request", async (assert) => {
			// arrange
			const data = { request: false }
			const server = new Server()
			route.post("/", () => data.request = true)

			// act
			await server.run()
			await request.post("/")
			await server.stop()

			// assert
			assert(data.request).toBe(true)
		})

		// -------------------------------------------------
		// Test 6
		// -------------------------------------------------

		test("Correctly call PUT request", async (assert) => {
			// arrange
			const data = { request: false }
			const server = new Server()
			route.put("/", () => data.request = true)

			// act
			await server.run()
			await request.put("/")
			await server.stop()

			// assert
			assert(data.request).toBe(true)
		})

		// -------------------------------------------------
		// Test 7
		// -------------------------------------------------

		test("Correctly call PATCH request", async (assert) => {
			// arrange
			const data = { request: false }
			const server = new Server()
			route.patch("/", () => data.request = true)

			// act
			await server.run()
			await request.patch("/")
			await server.stop()

			// assert
			assert(data.request).toBe(true)
		})

		// -------------------------------------------------
		// Test 8
		// -------------------------------------------------

		test("Correctly call DELETE request", async (assert) => {
			// arrange
			const data = { request: false }
			const server = new Server()
			route.delete("/", () => data.request = true)

			// act
			await server.run()
			await request.delete("/")
			await server.stop()

			// assert
			assert(data.request).toBe(true)
		})

		// -------------------------------------------------
		// Test 9
		// -------------------------------------------------

		test("Even with query params it still routes correctly", async (assert) => {
			// arrange
			const data = { request: {} }
			const server = new Server()
			route("/", (t) => data.request = t.query)

			// act
			await server.run()
			await request.get("/?test=hi")
			await server.stop()

			// assert
			assert(data.request).toBe({test: "hi"})
		})

		// -------------------------------------------------
		// Test 10
		// -------------------------------------------------

		test("Request generated correctly to controller", async (assert) => {
			// arrange
			const data = { request: {} as any }
			const server = new Server()
			route("/", (t) => data.request = t)

			// act
			await server.run()
			await request.get("/")
			await server.stop()

			// assert
			assert(data.request.file).toBeDefined()
			assert(data.request.query).toBe({})
			assert(data.request.middlewares).toBe([])
			assert(data.request.params).toBe({})
			assert(data.request.method).toBe("GET")
			assert(data.request.status).toBe(null)
			assert(data.request.url).toBe("/")
			assert(data.request.headers).toBe({
				host: "localhost:3000",
				"accept-encoding": "gzip, deflate",
				connection: "close",
			})
		})

		// -------------------------------------------------
		// Test 11
		// -------------------------------------------------

		test("Check if request has lower-cased the headers", async (assert) => {
			// arrange
			const data = { request: {} as any }
			const server = new Server()
			route("/", (t) => data.request = t)

			// act
			await server.run()
			await request.get("/").set("Custom-Header", "Custom-Value")
			await server.stop()

			// assert
			assert(data.request.headers["custom-header"]).toBeDefined()
		})

		// -------------------------------------------------
		// Test 12
		// -------------------------------------------------

		test("Check if headers sent by client are present", async (assert) => {
			// arrange
			const data = { request: {} as any }
			const server = new Server()
			route("/", (t) => data.request = t)

			// act
			await server.run()
			await request.get("/").set("Custom-Header", "Custom-Value")
			await server.stop()

			// assert
			assert(data.request.headers["custom-header"]).toBe("Custom-Value")
		})
	}).tag(["http", "adapter"])
})