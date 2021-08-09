// Packages
import test from "@acai/testing"

// Modules
import Server from "../modules/server"

test.group("Server tests", () => {
	test.group("Adapters", () => {
	// -------------------------------------------------
	// Test 1
	// -------------------------------------------------

		test("Adapter correctly added to server", (assert) => {
		// arrange
			const server = new Server()

			// act
			server.addAdapter("test", {} as any)

			// assert
			assert(server.getAdapter("test")).toBe({
				name: "test",
				adapter: {},
				middlewares: {},
				providers: [],
				globals: [],
				config: {},
			})
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Adapter correctly added with config to server", (assert) => {
		// arrange
			const server = new Server()

			// act
			server.addAdapter("test", {} as any, { testConfig: true })

			// assert
			assert(server.getAdapter("test")).toBe({
				name: "test",
				adapter: {},
				middlewares: {},
				providers: [],
				globals: [],
				config: {
					testConfig: true,
				},
			})
		})

		// -------------------------------------------------
		// Test 3
		// -------------------------------------------------

		test("Adapter correctly removed from server", (assert) => {
		// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.removeAdapter("test")

			// assert
			assert(server.getAdapter("test")).toBeUndefined()
		})

		// -------------------------------------------------
		// Test 4
		// -------------------------------------------------

		test("Adapter correctly merged config from instance", (assert) => {
		// arrange
			const server = new Server()
			server.addAdapter("test", {} as any, { configOne: true })

			// act
			server.setConfig("test", { configTwo: true })

			// assert
			assert(server.getAdapter("test")).toBeDefined()
			assert(server.getAdapter("test")?.config).toBeDefined().toBe({ configOne: true, configTwo: true })
		})

		// -------------------------------------------------
		// Test 5
		// -------------------------------------------------

		test("Adapter correctly merged config from method", (assert) => {
		// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.setConfig("test", { configOne: true })
			server.setConfig("test", { configTwo: true })

			// assert
			assert(server.getAdapter("test")).toBeDefined()
			assert(server.getAdapter("test")?.config).toBeDefined().toBe({ configOne: true, configTwo: true })
		})

		// -------------------------------------------------
		// Test 6
		// -------------------------------------------------

		test("Add config to all adapters", (assert) => {
		// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.setConfig({ configOne: true })

			// assert
			assert(server.getAdapter("test")?.config).toBeDefined().toBe({ configOne: true })
			assert(server.getAdapter("test2")?.config).toBeDefined().toBe({ configOne: true })
		})

		// -------------------------------------------------
		// Test 7
		// -------------------------------------------------

		test("Add config to specific adapter using string", (assert) => {
		// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.setConfig("test", { configOne: true })

			// assert
			assert(server.getAdapter("test")?.config).toBeDefined().toBe({ configOne: true })
			assert(server.getAdapter("test2")?.config).toBeDefined().toBe({})
		})

		// -------------------------------------------------
		// Test 8
		// -------------------------------------------------

		test("Add config to specific adapter using array", (assert) => {
		// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.setConfig(["test"], { configOne: true })

			// assert
			assert(server.getAdapter("test")?.config).toBeDefined().toBe({ configOne: true })
			assert(server.getAdapter("test2")?.config).toBeDefined().toBe({})
		})

		// -------------------------------------------------
		// Test 9
		// -------------------------------------------------

		test("Add config to a group of adapters", (assert) => {
		// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.setConfig(["test", "test3"], { configOne: true })

			// assert
			assert(server.getAdapter("test")?.config).toBeDefined().toBe({ configOne: true })
			assert(server.getAdapter("test2")?.config).toBeDefined().toBe({})
			assert(server.getAdapter("test3")?.config).toBeDefined().toBe({ configOne: true })
		})
	}).tag(["server", "adapter"])
})