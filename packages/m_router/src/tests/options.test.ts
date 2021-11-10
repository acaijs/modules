// Packages
import test from "@acai/testing"

// Modules
import { route } from ".."

test.group("Options group route tests", (group) => {
	group.afterEach(() => route.clear())

	test("test simple options string", expect => {
		// create route
		route.options({middleware: "test"}, () => {
			route("/", "test/you")
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe("test")
	})

	test("test simple options array", expect => {
		// create route
		route.options({middleware: ["test"]}, () => {
			route("/", "test/you")
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe(["test"])
	})

	test("test simple options object", expect => {
		// create route
		route.options({middleware: {auth: "admin"}}, () => {
			route("/", "test/you")
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe({auth: "admin"})
	})

	test("test add options object", expect => {
		// create route
		route.options({middleware: {auth: "admin"}}, () => {
			route.options({middleware: {type: "test"}}, () => {
				route("/", "test/you")
			})
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe({auth: "admin", type: "test"})
	})

	test("test add options array", expect => {
		// create route
		route.options({middleware: ["test"]}, () => {
			route.options({middleware: ["auth"]}, () => {
				route("/", "test/you")
			})
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe(["test", "auth"])
	})

	test("test add options array with many options", expect => {
		// create route
		route.options({middleware: ["test1", "test2"]}, () => {
			route.options({middleware: ["test3", "test4"]}, () => {
				route("/", "test/you")
			})
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe(["test1", "test2", "test3", "test4"])
	})

	test("test overwrite options object", expect => {
		// create route
		route.options({middleware: {auth: "admin"}}, () => {
			route.options({"!middleware": {type: "test"}}, () => {
				route("/", "test/you")
			})
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe({type: "test"})
	})

	test("test overwrite options array", expect => {
		// create route
		route.options({middleware: ["test"]}, () => {
			route.options({"!middleware": ["auth"]}, () => {
				route("/", "test/you")
			})
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe(["auth"])
	})

	test("test if context is not leaking from sibling groups", expect => {
		// create route
		route.options({ middleware: [ "auth" ] }, () => {
			route("/auth", "yes")
		})

		route.options({}, () => {
			route("/unauth", "no")
		})

		// get data
		const [route1, route2] = route.build()

		// test first route
		expect(route1).toBeDefined()
		expect(route1.path).toBe("/auth")
		expect(route1.file).toBe("yes")
		expect(route1.options.middleware).toBeDefined()

		// test second route
		expect(route2).toBeDefined()
		expect(route2.path).toBe("/unauth")
		expect(route2.file).toBe("no")
		expect(route2.options.middleware).toBeUndefined()
	})

	test("test values persistance through nesting", expect => {
		// create route
		route.options({middleware: ["auth"]}, () => {
			route.options({}, () => {
				route("/", "test/you")
			})
		})

		// get data
		const routes = route.build()[0]

		expect(routes).toBeDefined()
		expect(routes.options.middleware).toBeDefined().toBe(["auth"])
	})
}).tag(["options"])