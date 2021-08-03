// Packages
import test from "@acai/testing"

// Modules
import Validator from "../../../modules/validator"

// Rules
import rule from "./index"

// concrete validator class
class TestValidator extends Validator {
	public throwable = false;

	public getSchema() {
		return {
			fieldString		: ["string"	, "notIn:value"],
			fieldArray		: ["array"	, "notIn:value"],
			fieldObject		: ["object"	, "notIn:value"],
			fieldNumber		: ["number"	, "notIn:10"],
		}
	}
}

test.group("NotIn rule tests", () => {
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

	test.group("NotIn working with string", () => {
		test("Test success rule through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "notthatthing"})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldString).toBe("notthatthing")
		})

		test("Test fail rule contain through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "valuecontain"})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldString).toBe(["fieldString should not include values: value"])
		})

		test("Test fail rule through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "value"})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldString).toBe(["fieldString should not include values: value"])
		})
	})

	// array

	test.group("NotIn working with array", () => {
		test("Test success rule through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["shouldpass"]})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldArray).toBe(["shouldpass"])
		})

		test("Test failed rule contain through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["valuecontain"]})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldArray).toBe(["fieldArray should not include values: value"])
		})

		test("Test fail rule through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["value"]})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldArray).toBe(["fieldArray should not include values: value"])
		})
	})

	// object

	test.group("NotIn working with object", () => {
		test("Test success rule through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {shouldPass: true}})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldObject).toBe({shouldPass: true})
		})

		test("Test failed rule contain through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {valueToContain: true}})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldObject).toBeUndefined()
		})

		test("Test fail rule through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {value: true}})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldObject).toBeUndefined()
			expect(validator.errors.errors.fieldObject).toBe(["fieldObject should not include values: value"])
		})
	})

	// number

	test.group("NotIn working with number", () => {
		test("Test success rule through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 20})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldNumber).toBe(20)
		})

		test("Test fail rule contain through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 210})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldNumber).toBe(["fieldNumber should not include values: 10"])
		})

		test("Test fail rule through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 10})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldNumber).toBe(["fieldNumber should not include values: 10"])
		})
	})

	// -------------------------------------------------
	// Direct rule tests
	// -------------------------------------------------

	test("Test success rule directly (string)", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "shouldpass", key: "field", fields: {}, args: ["value"], rules: ["string", "notIn:value"]})

		expect(result).toBe(true)
	})

	test("Test fail rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "value", key: "field", fields: {}, args: ["value"], rules: ["string", "notIn:value"]})

		expect(result).toBe(false)
	})

	test("Test fail rule message directly", (expect) => {
		const result = rule.onError && rule.onError({value: "value", key: "field", fields: {}, args: ["value"], rules: ["string", "notIn:value"]})

		expect(result).toBe("field should not include values: value")
	})
}).tag(["rule", "in"])
