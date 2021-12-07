// Packages
import test from "@acai/testing"

// Modules
import { route } from ".."
import { getMacro, clearMacros } from "../utils/context"

test.group("Macro route tests", (group) => {
	group.afterEach(() => route.clear())
	group.afterEach(() => clearMacros())

	test("Create macro", expect => {
		// create route
		route.macro("newmacro", () => { route("test", "test") })

		// get data
		expect(getMacro("newmacro")).toBeDefined()
	})

	test("Throw if trying to access inexistant macro", expect => {
		expect(() => {
			getMacro("yay")
		}).toThrow()
	})

	test("Use macro", expect => {
		// create route
		route.macro("newmacro", () => {
			route("test", "file")
		})

		route.use("newmacro")

		// get data
		const routes = route.build()

		// get data
		expect(routes[0]).toBeDefined()
		expect(routes[0].file).toBe("file")
		expect(routes[0].path).toBe("/test")
	})

	test("Use macro dinamic arguments", expect => {
		// create route
		route.macro("newmacro", (testname: string, filename: string) => {
			route(testname, filename)
		})

		route.use("newmacro", "test", "file")

		// get data
		const routes = route.build()

		// get data
		expect(routes[0]).toBeDefined()
		expect(routes[0].file).toBe("file")
		expect(routes[0].path).toBe("/test")
	})
}).tag(["route"])