// Packages
import test from "@acai/testing"

// Modules
import { route } from ".."

test.group("Group route tests", (group) => {
	group.afterEach(() => route.clear())

	test("test simple group route", expect => {
		// create route
		route.group("/prefix", () => {
			route("/", "test/you")
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.path).toBe("/prefix")
		expect(routes.file).toBe("test/you")
	})

	test("test multiple grouped routes", expect => {
		// create route
		route.group("/prefix", () => {
			route("/", "test/you")
		})

		route.group("/another", () => {
			route("/", "test/me")
		})

		// get data
		const routes = route.build()

		expect(routes[0]).toBeDefined()
		expect(routes[0].path).toBe("/prefix")
		expect(routes[0].file).toBe("test/you")

		expect(routes[1]).toBeDefined()
		expect(routes[1].path).toBe("/another")
		expect(routes[1].file).toBe("test/me")
	})

	test("test single double nest group", expect => {
		// create route
		route.group("/prefix", () => {
			route.group("/double", () => {
				route("/", "test/you")
			})
		})

		// get data
		const routes = route.build()

		expect(routes[0]).toBeDefined()
		expect(routes[0].path).toBe("/prefix/double")
		expect(routes[0].file).toBe("test/you")
	})

	test("test double double nest group", expect => {
		// create route
		route.group("/prefix", () => {
			route.group("/double", () => {
				route("/", "test/you")
			})
		})

		route.group("/another", () => {
			route.group("/double", () => {
				route("/", "test/me")
			})
		})

		// get data
		const routes = route.build()

		expect(routes[0]).toBeDefined()
		expect(routes[0].path).toBe("/prefix/double")
		expect(routes[0].file).toBe("test/you")

		expect(routes[1]).toBeDefined()
		expect(routes[1].path).toBe("/another/double")
		expect(routes[1].file).toBe("test/me")
	})
}).tag(["group"])