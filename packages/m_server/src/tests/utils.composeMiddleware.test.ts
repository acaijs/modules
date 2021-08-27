// Packages
import test from "@acai/testing"

// Modules
import composeMiddlewares from "../utils/composeMiddlewares"

test.group("Utils", () => {
	test.group("Compose middleware utils", () => {
		// -------------------------------------------------
		// Test 1
		// -------------------------------------------------

		test("Run successfully through compose", (assert) => {
			// arrange
			const middleware = (r, n) => n(r)
			const composed = composeMiddlewares([[middleware, undefined], [middleware, undefined]])(t => t)

			// act
			const response = composed(1)

			// assert
			assert(response).toBe(1)
		})

		// -------------------------------------------------
		// Test 2
		// -------------------------------------------------

		test("Pass arguments to middleware", (assert) => {
			// arrange
			const data = {args: null}
			const middleware = (r, n, a) => {data.args = a; return n(r)}
			const composed = composeMiddlewares([[middleware, ["2", "3"]]])(t => t)

			// act
			composed(1)

			// assert
			assert(data.args).toBe(["2", "3"])
		})
	}).tag(["deepMerge"])
}).tag("utils")