import TestInterface from "../interfaces/TestInterface"

const TestResponse = (test: TestInterface) => ({
	tags: (tags: string | string[]) => {
		const usetags = typeof tags === "string" ? [tags] : tags

		test.tags = [...(test.tags || []), ...usetags]

		return TestResponse(test)
	},
	only: () => {
		test.only = true

		return TestResponse(test)
	},
	except: () => {
		test.except = true

		return TestResponse(test)
	},
	wip: () => {
		test.wip = true

		return TestResponse(test)
	},
})

export default TestResponse