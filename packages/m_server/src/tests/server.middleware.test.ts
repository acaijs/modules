// Packages
import test from "@acai/testing"

// Modules
import Server from "../modules/server"

// Adapters
import MockAdapter from "../adapters/mock"

test.group("Server tests", () => {
	test.group("Middlewares", () => {
	// -------------------------------------------------
	// Test 1
	// -------------------------------------------------

		test("Middleware correctly added to single adapter", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.addMiddleware("test", "test", middleware)

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({ test: middleware })
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Middleware correctly added to all adapters", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addMiddleware("test", middleware)

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({ test: middleware })
			assert(server.getAdapter("test2")?.middlewares).toBe({ test: middleware })
		})

		// -------------------------------------------------
		// Test 3
		// -------------------------------------------------

		test("Middleware correctly added to a group of adapters", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addMiddleware(["test", "test3"], "test", middleware)

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({ test: middleware })
			assert(server.getAdapter("test2")?.middlewares).toBe({})
			assert(server.getAdapter("test3")?.middlewares).toBe({ test: middleware })
		})

		// -------------------------------------------------
		// Test 4
		// -------------------------------------------------

		test("Middlewares correctly added to single adapter", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addMiddlewares("test", {test: middleware, test2: middleware})

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({ test: middleware, test2: middleware })
			assert(server.getAdapter("test2")?.middlewares).toBe({})
		})

		// -------------------------------------------------
		// Test 5
		// -------------------------------------------------

		test("Middlewares correctly added to all adapters", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addMiddlewares({test: middleware, test2: middleware})

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({ test: middleware, test2: middleware })
			assert(server.getAdapter("test2")?.middlewares).toBe({ test: middleware, test2: middleware })
		})

		// -------------------------------------------------
		// Test 6
		// -------------------------------------------------

		test("Middlewares correctly added to a group of adapters", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addMiddlewares(["test", "test3"], {test: middleware, test2: middleware})

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({ test: middleware, test2: middleware })
			assert(server.getAdapter("test2")?.middlewares).toBe({})
			assert(server.getAdapter("test3")?.middlewares).toBe({ test: middleware, test2: middleware })
		})

		// -------------------------------------------------
		// Test 7
		// -------------------------------------------------

		test("Remove single middleware (using string) from a single adapter", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addMiddleware("test", "test", middleware)

			// act
			server.clearMiddlewares("test", "test")

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({})
		})

		// -------------------------------------------------
		// Test 8
		// -------------------------------------------------

		test("Remove single middleware (using array) from a single adapter", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addMiddleware("test", "test", middleware)

			// act
			server.clearMiddlewares("test", ["test"])

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({})
		})

		// -------------------------------------------------
		// Test 9
		// -------------------------------------------------

		test("Remove multiple middlewares from a single adapter", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addMiddleware("test", "test", middleware)
			server.addMiddleware("test", "test2", middleware)

			// act
			server.clearMiddlewares("test", ["test", "test2"])

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({})
		})

		// -------------------------------------------------
		// Test 10
		// -------------------------------------------------

		test("Remove single middleware from all adapters", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addMiddleware("test", "test", middleware)
			server.addMiddleware("test2", "test", middleware)

			// act
			server.clearMiddlewares("test")

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({})
			assert(server.getAdapter("test2")?.middlewares).toBe({})
		})

		// -------------------------------------------------
		// Test 11
		// -------------------------------------------------

		test("Remove multiple middlewares from all adapters", (assert) => {
			// arrange
			const middleware = v => v
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addMiddleware("test", "test", middleware)
			server.addMiddleware("test2", "test", middleware)
			server.addMiddleware("test", "test2", middleware)
			server.addMiddleware("test2", "test2", middleware)
			server.addMiddleware("test", "test3", middleware)
			server.addMiddleware("test2", "test3", middleware)

			// act
			server.clearMiddlewares(["test2", "test3"])

			// assert
			assert(server.getAdapter("test")?.middlewares).toBe({ test: middleware })
			assert(server.getAdapter("test2")?.middlewares).toBe({ test: middleware })
		})

		// -------------------------------------------------
		// Test 12
		// -------------------------------------------------

		test("Add middleware as object", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.addMiddleware("test", "test", { onApply: (r, n) => n(r)  })

			// assert
			assert(server.getAdapter("test")?.middlewares.test).toBeDefined()
		})

		// -------------------------------------------------
		// Test 13
		// -------------------------------------------------

		test("Add middleware as callback", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.addMiddleware("test", "test", (r, n) => n(r))

			// assert
			assert(server.getAdapter("test")?.middlewares.test).toBeDefined()
		})

		// -------------------------------------------------
		// Test 14
		// -------------------------------------------------

		test("Middlewares run in the correct order", async (assert) => {
			// arrange
			const adapter = new MockAdapter()
			const data = { m1: null, m2: null }
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addMiddleware("test1", (r: any, n) => {data.m1 = r.n; r.n++; return n(r)})
			server.addMiddleware("test2", (r: any, n) => {data.m2 = r.n; r.n++; return n(r)})
			await server.run("test")

			// act
			await adapter.makeRequest({n: 0}, (r) => r, ["test1", "test2"])

			// assert
			assert(data.m1).toBe(0)
			assert(data.m2).toBe(1)
		})

		// -------------------------------------------------
		// Test 15
		// -------------------------------------------------

		test("Check forwarded request data injection through middlewares", async (assert) => {
			// arrange
			const adapter = new MockAdapter()
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addMiddleware("test1", (r: any, n) => {r.n++; return n(r)})
			await server.run("test")

			// act
			const response = await adapter.makeRequest({n: 0}, (r) => r, ["test1"])

			// assert
			assert(response.n).toBe(1)
		})

		// -------------------------------------------------
		// Test 16
		// -------------------------------------------------

		test("Use args in middleware", async (assert) => {
			// arrange
			const data = {args: null as any}
			const adapter = new MockAdapter()
			const server = new Server()
			server.addAdapter("test", adapter)
			server.addMiddleware("test1", (r, n, args) => {data.args = args; return n(r)})
			await server.run("test")

			// act
			await adapter.makeRequest({n: 0}, (r) => r, ["test1:2,5"])

			// assert
			assert(data.args).toBe(["2", "5"])
		})
	}).tag(["server", "middleware"])
})