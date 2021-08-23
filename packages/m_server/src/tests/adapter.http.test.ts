// Packages
import test from "@acai/testing"

// Modules
import Server from "../modules/server"

test.group("Adapter tests", () => {
	test.group("HTTP", () => {
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
				running: false,
				handler: undefined,
			})
		})
	}).tag(["http", "adapter"])
})