import test from "../index"

test.group("group 1", () => {
	test("test 1", (assert) => {
		assert(2).toBe(2)
	})
})

test.group("group 2", () => {
	test("test 1", (assert) => {
		assert(2).toBe(2)
	})

	test.group("subgroup", () => {
		test("test 1", (assert) => {
			assert(2).toBe(2)
		})
	})
})

test.group("group 3", () => {
	test("test 1", (assert) => {
		assert(2).toBe(2)
	})
})