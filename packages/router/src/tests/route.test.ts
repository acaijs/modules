// Packages
import test from "@acai/testing"

// Modules
import { route } from ".."

test.group("Simple route tests", (group) => {
	group.afterEach(() => route.clear())

	test("test simple route", expect => {
		// create route
		route("/", "test/you")

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.path).toBe("/")
		expect(routes.file).toBe("test/you")
	})

	test("test multiple routes", expect => {
		// create route
		route("/", 		"test/you")
		route("/hi", 	"/test/hi")

		// get data
		const routes = route.build()

		expect(routes[0]).toBeDefined()
		expect(routes[0].path).toBe("/")
		expect(routes[0].file).toBe("test/you")

		expect(routes[1]).toBeDefined()
		expect(routes[1].path).toBe("/hi")
		expect(routes[1].file).toBe("test/hi")
	})

	test("test route with same path overwrite", expect => {
		// create route
		route("/", 	"test/you")
		route("/", 	"/test/hi")

		// get data
		const routes = route.build()

		expect(routes[0]).toBeDefined()
		expect(routes[0].path).toBe("/")
		expect(routes[0].file).toBe("test/hi")
		expect(routes.length).toBe(1)
	})

	test("test multiple routes with the same path using many", expect => {
		// create route
		route.many(["GET", "POST"], "/", "test/you")

		// get data
		const routes = route.build()

		expect(routes.length).toBe(2)

		expect(routes[0]).toBeDefined()
		expect(routes[0].method).toBe("GET")
		expect(routes[0].path).toBe("/")
		expect(routes[0].file).toBe("test/you")

		expect(routes[1]).toBeDefined()
		expect(routes[1].method).toBe("POST")
		expect(routes[1].path).toBe("/")
		expect(routes[1].file).toBe("test/you")
	})
}).tag(["route"])