// Packages
import test from "@acai/testing"

// Modules
import Server from "../modules/server"

// Adapters
import MockAdapter from "../adapters/mock"

// Exceptions
import AdapterNotFound from "../exceptions/adapterNotFound"

test.group("Server tests", () => {
	test.group("Exception", () => {
		// -------------------------------------------------
		// Test 1
		// -------------------------------------------------

		test("Throw exception when not finding adapter name when running", (assert) => {
			// arrange
			const server = new Server()

			// act
			server.addAdapter("test", {} as any)

			// assert
			assert(() => server.run("test2")).toThrow(new AdapterNotFound("test2"))
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Correctly catch exception thrown when booting server", async (assert) => {
			// arrange
			const data = {boot:false}
			const server = new Server()
			server.addAdapter("test", {
				boot: () => {
					throw new Error("Boot error")
				},
				onRequest: () => {},
				shutdown: () => {},
			})
			server.addProvider({
				onError: ({ error }) => { if (error.message === "Boot error") data.boot = true },
			})

			// act
			await server.run("test")

			// assert
			assert(data.boot).toBe(true)
		})

		// -------------------------------------------------
		// Test 3
		// -------------------------------------------------

		test("Correctly catch exception thrown when making a request (controller)", async (assert) => {
			// arrange
			const adapter = new MockAdapter()
			const data = {controller:false}
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addProvider({
				onError: ({ error }) => { if (error.message === "Controller error") data.controller = true },
			})

			// act
			await server.run("test")
			await adapter.makeRequest({}, () => {throw new Error("Controller error")})

			// assert
			assert(data.controller).toBe(true)
		})

		// -------------------------------------------------
		// Test 4
		// -------------------------------------------------

		test("Correctly catch exception thrown when making a request (global)", async (assert) => {
			// arrange
			const adapter = new MockAdapter()
			const data = {global:false}
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addProvider({
				onError: ({ error }) => { if (error.message === "Global error") data.global = true },
			})

			// act
			await server.addGlobal(() => { throw new Error("Global error") })
			await server.run("test")
			await adapter.makeRequest({}, () => {})

			// assert
			assert(data.global).toBe(true)
		})

		// -------------------------------------------------
		// Test 5
		// -------------------------------------------------

		test("Correctly catch exception thrown when making a request (middleware)", async (assert) => {
			// arrange
			const adapter = new MockAdapter()
			const data = {global:false}
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addProvider({
				onError: ({ error }) => { if (error.message === "Middleware error") data.global = true },
			})

			// act
			await server.addMiddleware("test", () => { throw new Error("Middleware error") })
			await server.run("test")
			await adapter.makeRequest({}, () => {}, ["test"])

			// assert
			assert(data.global).toBe(true)
		})

		// -------------------------------------------------
		// Test 6
		// -------------------------------------------------

		test("Correctly catch exception thrown when making a request (provider boot)", async (assert) => {
			// arrange
			const adapter = new MockAdapter()
			const data = {global:false}
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addProvider({
				boot: () => { throw new Error("Provider error") },
				onError: ({ error }) => { if (error.message === "Provider error") data.global = true },
			})

			// act
			await server.run("test")
			await adapter.makeRequest({}, () => {})

			// assert
			assert(data.global).toBe(true)
		})

		// -------------------------------------------------
		// Test 7
		// -------------------------------------------------

		test("Throw when middleware name is not found", async (assert) => {
			// arrange
			const adapter = new MockAdapter()
			const data = {middleware:false}
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addProvider({
				onError: ({ error }) => { if (error.message.match("Middleware test2 was not found for route")) data.middleware = true },
			})

			// act
			await server.run("test")
			await adapter.makeRequest({}, () => {}, ["test2"])

			// assert
			assert(data.middleware).toBe(true)
		})
	}).tag(["server", "exception"])
})