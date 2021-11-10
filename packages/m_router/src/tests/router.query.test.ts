// Packages
import test from "@acai/testing"

// Modules
import { route, router } from ".."

test.group("Router query methods", (group) => {
	group.beforeEach(route.clear)

	test("basic query key/value pair", (expect) => {
		// build routes
		route("/", "root")

		// get match
		const match = router("/?key=value", "GET", route.build())!

		// assertions
		expect(match).toBeDefined()
		expect(match.query).toBe({key: "value"})
	})

	test("query with only key", (expect) => {
		// build routes
		route("/", "root")

		// get match
		const match = router("/?key", "GET", route.build())!

		// assertions
		expect(match).toBeDefined()
		expect(match.query).toBe({key: true})
	})

	test("query with number value", (expect) => {
		// build routes
		route("/", "root")

		// get match
		const match = router("/?key=123", "GET", route.build())!

		// assertions
		expect(match).toBeDefined()
		expect(match.query).toBe({key: 123})
	})

	test("query with boolean true value", (expect) => {
		// build routes
		route("/", "root")

		// get match
		const match = router("/?key=true", "GET", route.build())!

		// assertions
		expect(match).toBeDefined()
		expect(match.query).toBe({key: true})
	})

	test("query with boolean false value", (expect) => {
		// build routes
		route("/", "root")

		// get match
		const match = router("/?key=false", "GET", route.build())!

		// assertions
		expect(match).toBeDefined()
		expect(match.query).toBe({key: true})
	})

	test("query with composite string value", (expect) => {
		// build routes
		route("/", "root")

		// get match
		const match = router("/?key=complete string", "GET", route.build())!

		// assertions
		expect(match).toBeDefined()
		expect(match.query).toBe({key: "complete string"})
	})
}).tag(["router", "query"])