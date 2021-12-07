// Packages
import test from "@acai/testing"

// Modules
import Validator from "../../../modules/validator"

// Rules
import rule from "./index"

// concrete validator class
class TestValidator extends Validator {
	public throwable = false

	public getSchema() {
		return {
			fieldString		: ["string"	, "in:value"],
			fieldArray		: ["array"	, "in:value"],
			fieldObject		: ["object"	, "in:value"],
			fieldNumber		: ["number"	, "in:10"],
		}
	}
}

test.group("In rule tests", () => {
	// -------------------------------------------------
	// Validator tests
	// -------------------------------------------------

	test("Get rule from validator", (expect) => {
		const validator = new TestValidator({field: 2})
		const required 	= validator.rules.array

		expect(required).toBeDefined()
		expect(required.onError).toBeDefined()
		expect(required.onValidate).toBeDefined()
	})

	// -------------------------------------------------
	// Validator rule tests
	// -------------------------------------------------

	// string

	test.group("In working with string", () => {
		test("Test success rule through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "value"})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldString).toBe("value")
		})

		test("Test success rule contain through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "valuecontain"})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldString).toBe("valuecontain")
		})

		test("Test fail rule through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "nottrue"})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldString).toBe(["fieldString does not include values: value"])
		})
	})

	// array

	test.group("In working with array", () => {
		test("Test success rule through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["value"]})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldArray).toBe(["value"])
		})

		test("Test failed rule contain through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["valuecontain"]})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
		})

		test("Test fail rule through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["nottrue"]})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldArray).toBe(["fieldArray does not include values: value"])
		})
	})

	// object

	test.group("In working with object", () => {
		test("Test success rule through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {value: true}})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldObject).toBe({value: true})
		})

		test("Test failed rule contain through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {valueToContain: true}})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldObject).toBeUndefined()
		})

		test("Test fail rule through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {noTrue: true}})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldObject).toBeUndefined()
			expect(validator.errors.errors.fieldObject).toBe(["fieldObject does not include values: value"])
		})
	})

	// number

	test.group("In working with number", () => {
		test("Test success rule through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 10})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldNumber).toBe(10)
		})

		test("Test success rule contain through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 210})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldNumber).toBe(210)
		})

		test("Test fail rule through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 30})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldNumber).toBe(["fieldNumber does not include values: 10"])
		})
	})

	// -------------------------------------------------
	// Direct rule tests
	// -------------------------------------------------

	test("Test success rule directly (string)", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "value", key: "field", fields: {}, args: ["value"], rules: ["string", "in:value"]})

		expect(result).toBe(true)
	})

	test("Test fail rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "nottrue", key: "field", fields: {}, args: ["value"], rules: ["string", "in:value"]})

		expect(result).toBe(false)
	})

	test("Test fail rule message directly", (expect) => {
		const result = rule.onError && rule.onError({value: "nottrue", key: "field", fields: {}, args: ["value"], rules: ["string", "in:value"]})

		expect(result).toBe("field does not include values: value")
	})
}).tag(["rule", "in"])
