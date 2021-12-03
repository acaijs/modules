import TestInterface from "../interfaces/TestInterface"

const Assertion = (test: TestInterface) => (value: any) => ({
	/**
     *
     * @param comparator
     * @returns
     */
	toBe: (comparator: any) => {
		test.assertions.push({
			type: "toBe",
			skipped: false,
			pass: value === comparator,
			message: `${value} is not equals to ${comparator}`,
		})

		return Assertion(test)(value)
	},
})

export default Assertion