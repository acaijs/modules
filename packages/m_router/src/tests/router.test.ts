// Packages
import test from "@acai/testing"

// Modules
import { route, router } from ".."

test.group("Simple router methods", (group) => {
	group.beforeEach(route.clear)

	test("test root match", (expect) => {
		// build routes
		route("/non", 	"non/root")
		route("/", 		"root")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/")
		expect(match.file).toBe("root")
	})

	test("test non root match", (expect) => {
		// build routes
		route("/", 		"root")
		route("/non", 	"non/root")

		// get match
		const routes 	= route.build()
		const match 	= router("/non", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/non")
		expect(match.file).toBe("non/root")
	})

	test("test match with variable", (expect) => {
		// build routes
		route("/{id}",	"root")

		// get match
		const routes 	= route.build()
		const match 	= router("/id", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/{id}")
		expect(match.file).toBe("root")
	})

	test("test variable storage", (expect) => {
		// build routes
		route("/{id}",	"root")

		// get match
		const routes 	= route.build()
		const match 	= router("/value", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match?.variables.id).toBe("value")
	})

	test("test optional variable match", (expect) => {
		// build routes
		route("/{id?}",	"root")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match?.path).toBe("/{id?}")
		expect(match?.file).toBe("root")
	})

	test("test router with scalating route path", (expect) => {
		// build routes
		route.get("/",		"root")
		route.get("/test",	"test")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match?.path).toBe("/")
		expect(match?.file).toBe("root")
	})

	test("test router with scalating route path (with variable)", (expect) => {
		// build routes
		route.get("/",			"root")
		route.get("/{test}",	"test")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match?.path).toBe("/")
		expect(match?.file).toBe("root")
	})

	test("test router with scalating route path (with optional variable)", (expect) => {
		// build routes
		route.get("/",			"root")
		route.get("/{test?}",	"test")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match?.path).toBe("/")
		expect(match?.file).toBe("root")
	})

	test("test export a callback instead of a string", (expect) => {
		// build routes
		route.get("/", () => true)

		// get match
		const routes 	= route.build()
		const match 	= router("/", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match?.path).toBe("/")
		expect(typeof match?.file).toBe("function")
	})
}).tag(["router"])