// Packages
import test from "@acai/testing"

// Modules
import Validator from "../../../modules/validator"

// concrete validator class
class TestValidator extends Validator {
	public throwable = false;

	public getSchema() {
		return {
			fieldString		: ["string"	, "min:5"],
			fieldArray		: ["array"	, "min:2"],
			fieldObject		: ["object"	, "min:2"],
			fieldNumber		: ["number"	, "min:10"],
		}
	}
}

test.group("Min rule tests", () => {
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

	test.group("Min working with string", () => {
		test("Test success rule through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "value"})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldString).toBe("value")
		})

		test("Test fail rule through validator (string)", (expect) => {
			const validator = TestValidator.validate({fieldString: "val"})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldString).toBe(["fieldString has less characters than the allowed: 5"])
		})
	})

	// array

	test.group("Min working with array", () => {
		test("Test success rule through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["value", "value2"]})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldArray).toBe(["value", "value2"])
		})

		test("Test fail rule through validator (array)", (expect) => {
			const validator = TestValidator.validate({fieldArray: ["nottrue"]})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldArray).toBe(["fieldArray has less elements than the allowed: 2"])
		})
	})

	// object

	test.group("Min working with object", () => {
		test("Test success rule through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {value: true, value2: 5}})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldObject).toBe({value: true, value2: 5})
		})

		test("Test fail rule through validator (object)", (expect) => {
			const validator = TestValidator.validate({fieldObject: {noTrue: true}})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldObject).toBeUndefined()
			expect(validator.errors.errors.fieldObject).toBe(["fieldObject has less keys than the allowed: 2"])
		})
	})

	// number

	test.group("Min working with number", () => {
		test("Test success rule through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 10})

			expect(validator.errors).toBeUndefined()
			expect(validator.validated.fieldNumber).toBe(10)
		})

		test("Test fail rule through validator (number)", (expect) => {
			const validator = TestValidator.validate({fieldNumber: 5})

			expect(validator.errors).toBeDefined()
			expect(validator.validated.fieldArray).toBeUndefined()
			expect(validator.errors.errors.fieldNumber).toBe(["fieldNumber is less than the allowed: 10"])
		})
	})
}).tag(["rule", "min"])
