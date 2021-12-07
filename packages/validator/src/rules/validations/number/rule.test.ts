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
			field: ["number"],
			field2: ["number:force"],
		}
	}
}

test.group("Number rule tests", () => {
	// -------------------------------------------------
	// Validator tests
	// -------------------------------------------------

	test("Get rule from validator", (expect) => {
		const validator = new TestValidator({field: 1})
		const required 	= validator.rules.number

		expect(required).toBeDefined()
		expect(required.onError).toBeDefined()
		expect(required.onValidate).toBeDefined()
	})

	// -------------------------------------------------
	// Validator rule tests
	// -------------------------------------------------

	test("Test success rule through validator", (expect) => {
		const validator = TestValidator.validate({field: 4})

		expect(validator.errors).toBeUndefined()
		expect(validator.validated.field).toBe(4)
	})

	test("Test success forced rule through validator", (expect) => {
		const validator = TestValidator.validate({field2: "4"})

		expect(validator.errors).toBeUndefined()
		expect(validator.validated.field2).toBe(4)
	})

	test("Test fail rule through validator (strict)", (expect) => {
		const validator = TestValidator.validate({field: "4"})

		expect(validator.errors).toBeDefined()
		expect(validator.validated.field).toBeUndefined()
		expect(validator.errors.errors.field).toBe(["field is not a number"])
	})

	test("Test fail rule through validator (non strict)", (expect) => {
		const validator = TestValidator.validate({field2: "hi"})

		expect(validator.errors).toBeDefined()
		expect(validator.validated.field).toBeUndefined()
		expect(validator.errors.errors.field2).toBe(["field2 is not a number"])
	})

	// -------------------------------------------------
	// Direct rule tests
	// -------------------------------------------------

	test("Test success rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: 2, key: "field", fields: {}, rules: []})

		expect(result).toBe(true)
	})

	test("Test fail rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "number", key: "field", fields: {}, rules: []})

		expect(result).toBe(false)
	})

	test("Test fail rule message directly", (expect) => {
		const result = rule.onError && rule.onError({value: "number", key: "field", fields: {}, rules: []})

		expect(result).toBe("field is not a number")
	})
}).tag(["rule", "number"])
