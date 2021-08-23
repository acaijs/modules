// Packages
import test from "@acai/testing"

// Modules
import Server from "../modules/server"

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
	}).tag(["server", "exception"])
})