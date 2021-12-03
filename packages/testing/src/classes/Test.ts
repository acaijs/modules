import TestCallback from "../interfaces/TestCallback"
import TestInterface, { TestOptionsInterface } from "../interfaces/TestInterface"
import Assertion from "../utils/Assertion"
import TestResponse from "../utils/TestResponse"

const TestObject = () => {
	let categories = []
	const addStack = []
	let list = []

	const testProperties = ({
		test (description: string, callback: TestCallback, options: TestOptionsInterface = {}) {
			const testassertion = Assertion(list[list.length + 1])

			list.push({
				...options,

				context: [],
				description,
				callback: () => callback(testassertion),
				assertions: [],
			})

			return TestResponse(list[list.length])
		},

		except (description: string, callback: TestCallback, options: Omit<TestOptionsInterface, "except">) {
			return test(description, callback, {...options, except: true})
		},

		wip (description: string, callback: TestCallback, options: Omit<TestOptionsInterface, "wip">) {
			return test(description, callback, {...options, wip: true})
		},

		group (description: string, callback: any) {
			const ctx = [...categories, description]

			addStack.push(() => {
				categories = ctx

				callback()
			})
		},

		export () {
			while (addStack.length > 0) {
				addStack.forEach(i => i())
			}

			return list
		},

		merge (tests: TestInterface[]) {
			if (Array.isArray(tests))
				list = [...list, ...tests]
		},
	})

	const testmethod = (description: string, callback: TestCallback) => testProperties.test(description, callback)
	testmethod.test = testProperties.test
	testmethod.except = testProperties.except
	testmethod.wip = testProperties.wip
	testmethod.group = testProperties.group
	testmethod.export = testProperties.export
	testmethod.merge = testProperties.merge

	return testmethod
}


export default TestObject