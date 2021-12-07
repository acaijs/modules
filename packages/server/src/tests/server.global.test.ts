// Packages
import test from "@acai/testing"

// Modules
import Server from "../modules/server"

test.group("Server tests", () => {
	test.group("Globals", () => {
		// -------------------------------------------------
		// Test 1
		// -------------------------------------------------

		test("Add global to a single adapter using string", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addGlobal("test", middleware)

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Add global to a single adapter using array", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addGlobal(["test"], middleware)

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 3
		// -------------------------------------------------

		test("Add global to all adapters", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addGlobal(middleware)

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([middleware])
		})

		// -------------------------------------------------
		// Test 4
		// -------------------------------------------------

		test("Add global to a group of adapters", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addGlobal(["test", "test3"], middleware)

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([])
			assert(server.getAdapter("test3")?.globals).toBeDefined().toBe([middleware])
		})

		// -------------------------------------------------
		// Test 5
		// -------------------------------------------------

		test("Add multiple globals to a single adapter using string", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addGlobals("test", [middleware, middleware])

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware, middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 6
		// -------------------------------------------------

		test("Add multiple globals to a single adapter using array", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addGlobals(["test"], [middleware, middleware])

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware, middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 7
		// -------------------------------------------------

		test("Add multiple globals to a group of adapters", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addGlobals(["test", "test3"], [middleware, middleware])

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware, middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([])
			assert(server.getAdapter("test3")?.globals).toBeDefined().toBe([middleware, middleware])
		})

		// -------------------------------------------------
		// Test 8
		// -------------------------------------------------

		test("Add multiple globals to all adapters", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addGlobals([middleware, middleware])

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([middleware, middleware])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([middleware, middleware])
			assert(server.getAdapter("test3")?.globals).toBeDefined().toBe([middleware, middleware])
		})

		// -------------------------------------------------
		// Test 9
		// -------------------------------------------------

		test("Clear globals from a single adapter using string", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addGlobals([middleware, middleware])

			// act
			server.clearGlobals("test")

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([middleware, middleware])
		})

		// -------------------------------------------------
		// Test 10
		// -------------------------------------------------

		test("Clear globals from a single adapter using array", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addGlobals([middleware, middleware])

			// act
			server.clearGlobals(["test"])

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([middleware, middleware])
		})

		// -------------------------------------------------
		// Test 11
		// -------------------------------------------------

		test("Clear globals from all adapters", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addGlobals([middleware, middleware])

			// act
			server.clearGlobals()

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 12
		// -------------------------------------------------

		test("Clear globals from a group of adapters", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)
			server.addGlobals([middleware, middleware])

			// act
			server.clearGlobals(["test", "test3"])

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.globals).toBeDefined().toBe([middleware, middleware])
			assert(server.getAdapter("test3")?.globals).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 13
		// -------------------------------------------------

		test("Add global as object", (assert) => {
			// arrange
			const global = { onApply: async (r, n) => n(r) }
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.addGlobal(global)

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([global])
		})

		// -------------------------------------------------
		// Test 14
		// -------------------------------------------------

		test("Add global as callback", (assert) => {
			// arrange
			const global = (r, n) => n(r)
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.addGlobal(global)

			// assert
			assert(server.getAdapter("test")?.globals).toBeDefined().toBe([global])
		})
	}).tag(["server", "global"])
})