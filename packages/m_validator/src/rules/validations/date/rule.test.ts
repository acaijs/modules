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
			field: ["date"],
			field2: ["date:LLLL dd yyyy"],
		}
	}
}

test.group("Date rule tests", () => {
	// -------------------------------------------------
	// Validator tests
	// -------------------------------------------------

	test("Get rule from validator", (expect) => {
		const validator = new TestValidator({field: []})
		const required 	= validator.rules.array

		expect(required).toBeDefined()
		expect(required.onError).toBeDefined()
		expect(required.onValidate).toBeDefined()
	})

	// -------------------------------------------------
	// Validator rule tests
	// -------------------------------------------------

	test("Test success rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "2016-05-25"})

		expect(validator.errors).toBeUndefined()
		expect(validator.validated.field).toBe("2016-05-25")
	})

	test("Test fail rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "not.a.valid.date"})

		expect(validator.errors).toBeDefined()
		expect(validator.validated.field).toBeUndefined()
		expect((validator.errors as {errors: Record<string, string[]>}).errors.field).toBe(["field is not a valid date"])
	})

	test("Test success rule through validator (with format)", (expect) => {
		const validator = TestValidator.validate({field2: "May 25 1982"})

		expect(validator.errors).toBeUndefined()
		expect(validator.validated.field2).toBe("May 25 1982")
	})

	test("Test fail rule through validator (with format)", (expect) => {
		const validator = TestValidator.validate({field2: "not.a.valid.date"})

		expect(validator.errors).toBeDefined()
		expect(validator.validated.field2).toBeUndefined()
		expect((validator.errors as {errors: Record<string, string[]>}).errors.field2).toBe(["field2 is not a valid date"])
	})

	// -------------------------------------------------
	// Direct rule tests
	// -------------------------------------------------

	test("Test success rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "2016-05-25", key: "field", fields: {}, rules: []})

		expect(result).toBe(true)
	})

	test("Test fail rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "not.a.valid.date", key: "field", fields: {}, rules: []})

		expect(result).toBe(false)
	})

	test("Test fail rule message directly", (expect) => {
		const result = rule.onError && rule.onError({value: "not.a.valid.date", key: "field", fields: {}, rules: []})

		expect(result).toBe("field is not a valid date")
	})
}).tag(["rule", "array"])
