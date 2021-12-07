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
			field: ["regex:digit\\d+"],
		}
	}
}

test.group("Regex rule tests", () => {
	// -------------------------------------------------
	// Validator tests
	// -------------------------------------------------

	test("Get rule from validator", (expect) => {
		const validator = new TestValidator({field: 1})
		const required 	= validator.rules.email

		expect(required).toBeDefined()
		expect(required.onError).toBeDefined()
		expect(required.onValidate).toBeDefined()
	})

	// -------------------------------------------------
	// Validator rule tests
	// -------------------------------------------------

	test("Test success rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "digit5"})

		expect(validator.errors).toBeUndefined()
		expect(validator.validated.field).toBe("digit5")
	})

	test("Test fail rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "not.a.valid.regex"})

		expect(validator.errors).toBeDefined()
		expect(validator.validated.field).toBeUndefined()
		expect((validator.errors as {errors: Record<string, string[]>}).errors.field).toBe(["field does not passes the regex"])
	})

	// -------------------------------------------------
	// Direct rule tests
	// -------------------------------------------------

	test("Test success rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "digit5", key: "field", fields: {}, args: ["digit\\d+"], rules: []})

		expect(result).toBe(true)
	})

	test("Test fail rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "not.a.valid.regex", key: "field", args: ["digit\\d+"], fields: {}, rules: []})

		expect(result).toBe(false)
	})

	test("Test fail rule message directly", (expect) => {
		const result = rule.onError && rule.onError({value: "not.an.email", key: "field", fields: {}, args: ["digit\\d+"], rules: []})

		expect(result).toBe("field does not passes the regex")
	})
}).tag(["rule", "email"])
