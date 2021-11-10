// Packages
import test from "@acai/testing"

// Modules
import deepMerge from "../utils/deepMerge"

test.group("Utils", () => {
	test.group("Deep merge utils", () => {
		// -------------------------------------------------
		// 1 - Test
		// -------------------------------------------------

		test("Merge two different objects", (assert) => {
			// arrange
			const obj1 = { value: true }
			const obj2 = { value2: true }

			// act
			const result = deepMerge(obj1, obj2)

			// assert
			assert(result).toBe({
				value: true,
				value2: true,
			})
		})

		// -------------------------------------------------
		// 2 - Test
		// -------------------------------------------------

		test("Overwrite object in first assignment", (assert) => {
			// arrange
			const obj1 = { value: true }
			const obj2 = { value: false }

			// act
			const result = deepMerge(obj1, obj2)

			// assert
			assert(result).toBe({
				value: false,
			})
		})
	}).tag(["deepMerge"])
}).tag("utils")