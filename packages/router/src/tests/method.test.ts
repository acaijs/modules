// Packages
import test from "@acai/testing"

// Modules
import { route, router } from ".."

test.group("Simple router type methods", (group) => {
	group.beforeEach(route.clear)

	test("test get match", (expect) => {
		// build routes
		route("/", 			"should/match")
		route.post("/", 	"shouldnt/match")
		route.put("/", 		"shouldnt/match")
		route.patch("/", 	"shouldnt/match")
		route.delete("/",	"shouldnt/match")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "GET", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/")
		expect(match.file).toBe("should/match")
	})

	test("test post match", (expect) => {
		// build routes
		route.get("/",		"shouldnt/match")
		route.post("/", 	"should/match")
		route.put("/", 		"shouldnt/match")
		route.patch("/", 	"shouldnt/match")
		route.delete("/",	"shouldnt/match")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "POST", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/")
		expect(match.file).toBe("should/match")
	})

	test("test put match", (expect) => {
		// build routes
		route.get("/", 		"shouldnt/match")
		route.post("/", 	"shouldnt/match")
		route.put("/", 		"should/match")
		route.patch("/", 	"shouldnt/match")
		route.delete("/",	"shouldnt/match")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "PUT", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/")
		expect(match.file).toBe("should/match")
	})

	test("test patch match", (expect) => {
		// build routes
		route.get("/",		"shouldnt/match")
		route.post("/", 	"shouldnt/match")
		route.put("/", 		"shouldnt/match")
		route.patch("/", 	"should/match")
		route.delete("/",	"shouldnt/match")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "PATCH", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/")
		expect(match.file).toBe("should/match")
	})

	test("test delete match", (expect) => {
		// build routes
		route.get("/",		"shouldnt/match")
		route.post("/", 	"shouldnt/match")
		route.put("/", 		"shouldnt/match")
		route.patch("/", 	"shouldnt/match")
		route.delete("/",	"should/match")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "DELETE", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/")
		expect(match.file).toBe("should/match")
	})

	test("test any match", (expect) => {
		// build routes
		route.any("/",		"should/match")
		route.post("/", 	"shouldnt/match")
		route.put("/", 		"shouldnt/match")
		route.patch("/", 	"shouldnt/match")

		// get match
		const routes 	= route.build()
		const match 	= router("/", "DELETE", routes)!

		// assertions
		expect(match).toBeDefined()
		expect(match.path).toBe("/")
		expect(match.file).toBe("should/match")
	})
}).tag(["router"])