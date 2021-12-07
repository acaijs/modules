// Packages
import { ProviderInterface } from "@acai/interfaces"
import test from "@acai/testing"

// Modules
import Server from "../modules/server"

test.group("Server tests", () => {
	test.group("Providers", () => {
	// -------------------------------------------------
	// Test 1
	// -------------------------------------------------

		test("Add provider to a single adapter using string", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addProvider("test", {})

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Add provider to a single adapter using array", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addProvider(["test"], {})

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 3
		// -------------------------------------------------

		test("Add provider to all adapters", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addProvider({})

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([{}])
		})

		// -------------------------------------------------
		// Test 4
		// -------------------------------------------------

		test("Add provider to a group of adapters", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addProvider(["test", "test3"], {})

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([])
			assert(server.getAdapter("test3")?.providers).toBeDefined().toBe([{}])
		})

		// -------------------------------------------------
		// Test 5
		// -------------------------------------------------

		test("Add multiple providers to a single adapter using string", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addProviders("test", [{}, {}])

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}, {}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 6
		// -------------------------------------------------

		test("Add multiple providers to a single adapter using array", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)

			// act
			server.addProviders(["test"], [{}, {}])

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}, {}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 7
		// -------------------------------------------------

		test("Add multiple providers to a group of adapters", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addProviders(["test", "test3"], [{}, {}])

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}, {}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([])
			assert(server.getAdapter("test3")?.providers).toBeDefined().toBe([{}, {}])
		})

		// -------------------------------------------------
		// Test 8
		// -------------------------------------------------

		test("Add multiple providers to all adapters", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)

			// act
			server.addProviders([{}, {}])

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([{}, {}])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([{}, {}])
			assert(server.getAdapter("test3")?.providers).toBeDefined().toBe([{}, {}])
		})

		// -------------------------------------------------
		// Test 9
		// -------------------------------------------------

		test("Clear providers from a single adapter using string", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addProviders([{}, {}])

			// act
			server.clearProviders("test")

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([{}, {}])
		})

		// -------------------------------------------------
		// Test 10
		// -------------------------------------------------

		test("Clear providers from a single adapter using array", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addProviders([{}, {}])

			// act
			server.clearProviders(["test"])

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([{}, {}])
		})

		// -------------------------------------------------
		// Test 11
		// -------------------------------------------------

		test("Clear providers from all adapters", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addProviders([{}, {}])

			// act
			server.clearProviders()

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 12
		// -------------------------------------------------

		test("Clear providers from a group of adapters", (assert) => {
			// arrange
			const server = new Server()
			server.addAdapter("test", {} as any)
			server.addAdapter("test2", {} as any)
			server.addAdapter("test3", {} as any)
			server.addProviders([{}, {}])

			// act
			server.clearProviders(["test", "test3"])

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([])
			assert(server.getAdapter("test2")?.providers).toBeDefined().toBe([{}, {}])
			assert(server.getAdapter("test3")?.providers).toBeDefined().toBe([])
		})

		// -------------------------------------------------
		// Test 13
		// -------------------------------------------------

		test("Add provider as object", (assert) => {
			// arrange
			const provider = { boot: async () => void {} }
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.addProvider(provider)

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([provider])
		})

		// -------------------------------------------------
		// Test 14
		// -------------------------------------------------

		test("Add provider as instance", (assert) => {
			// arrange
			class Provider implements ProviderInterface {
				public async onError () {}
			}
			const provider = new Provider()
			const server = new Server()
			server.addAdapter("test", {} as any)

			// act
			server.addProvider(provider)

			// assert
			assert(server.getAdapter("test")?.providers).toBeDefined().toBe([provider])
		})
	}).tag(["server", "provider"])
})