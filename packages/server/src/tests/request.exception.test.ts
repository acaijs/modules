import test from "@acai/testing"
import Server from ".."
import MockAdapter from "../adapters/mock"

test.group("Request tests", () => {
	test.group("Exception", () => {
		// -------------------------------------------------
		// Test 1
		// -------------------------------------------------

		test("Callback controller throws if you try to access a property from it", async assert => {
			// arrange
			const server = new Server()
			const mock = new MockAdapter()

			// act
			server.addAdapter("mock", mock)
			await server.run("mock")
			const response = await mock.makeRequest({data: "hi"}, "src/tests/utils/response.callback@test")

			// assert
			assert(response).toBe("Controller (/src/tests/utils/response.callback) is a callback but you are trying to access it as a class")
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Object controller throws if you don't try to access a property from it", async assert => {
			// arrange
			const server = new Server()
			const mock = new MockAdapter()

			// act
			server.addAdapter("mock", mock)
			await server.run("mock")
			const response = await mock.makeRequest({data: "hi"}, "src/tests/utils/response.object")

			// assert
			assert(response).toBe("Controller (/src/tests/utils/response.object) is a object but a method was not passed")
		})

		// -------------------------------------------------
		// Test 3
		// -------------------------------------------------

		test("Class controller throws if you don't try to access a property from it", async assert => {
			// arrange
			const server = new Server()
			const mock = new MockAdapter()

			// act
			server.addAdapter("mock", mock)
			await server.run("mock")
			const response = await mock.makeRequest({data: "hi"}, "src/tests/utils/response.class")

			// assert
			assert(response).toBe("Controller (/src/tests/utils/response.class) is a class but you are trying to access it as a function")
		})

		// -------------------------------------------------
		// Test 4
		// -------------------------------------------------

		test("Try to access a property that does not exist in the object controller", async assert => {
			// arrange
			const server = new Server()
			const mock = new MockAdapter()

			// act
			server.addAdapter("mock", mock)
			await server.run("mock")
			const response = await mock.makeRequest({data: "hi"}, "src/tests/utils/response.object@method")

			// assert
			assert(response).toBe("Controller (/src/tests/utils/response.object) did not provide a property for the method method")
		})

		// -------------------------------------------------
		// Test 5
		// -------------------------------------------------

		test("Class controller throws if you try to access an inexistant property from it", async assert => {
			// arrange
			const server = new Server()
			const mock = new MockAdapter()

			// act
			server.addAdapter("mock", mock)
			await server.run("mock")
			const response = await mock.makeRequest({data: "hi"}, "src/tests/utils/response.class@method")

			// assert
			assert(response).toBe("Controller (/src/tests/utils/response.class) did not provide a property for the method method or it was an arrow function (sadly we do not support them)")
		})

		// -------------------------------------------------
		// Test 6
		// -------------------------------------------------

		test("Request fails if you reference a inexistant controller file", async assert => {
			// arrange
			const server = new Server()
			const mock = new MockAdapter()

			// act
			server.addAdapter("mock", mock)
			await server.run("mock")
			const response = await mock.makeRequest({data: "hi"}, "i/dont/exist")

			// assert
			assert(response).toBe("Method undefined of the controller exist in the route undefined was not found")
		})
	})
})