// Packages
import test from "@acai/testing";

// Modules
import Validator from "../../../modules/validator";

// Rules
import rule from "./index";

// concrete validator class
class TestValidator extends Validator {
	public throwable = false;
	
	public getSchema() {
		return {
			field: ["email"]
		};
	}
}

test.group("Email rule tests", () => {
	// -------------------------------------------------
	// Validator tests
	// -------------------------------------------------

	test("Get rule from validator", (expect) => {
		const validator = new TestValidator({field: 1});
		const required 	= validator.rules.email;

		expect(required).toBeDefined();
		expect(required.onError).toBeDefined();
		expect(required.onValidate).toBeDefined();
	});

	// -------------------------------------------------
	// Validator rule tests
	// -------------------------------------------------

	test("Test success rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "john@doe.com"});

		expect(validator.errors).toBeUndefined();
		expect(validator.validated.field).toBe("john@doe.com");
	});

	test("Test fail rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "not.an.email"});

		expect(validator.errors).toBeDefined();
		expect(validator.validated.field).toBeUndefined();
		expect((validator.errors as {errors: Record<string, string[]>}).errors.field).toBe(["field is not an email"]);
	});

	// -------------------------------------------------
	// Direct rule tests
	// -------------------------------------------------

	test("Test success rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "john@doe.com", key: "field", fields: {}, rules: []});

		expect(result).toBe(true);
	});

	test("Test fail rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "not.an.email", key: "field", fields: {}, rules: []});

		expect(result).toBe(false);
	});

	test("Test fail rule message directly", (expect) => {
		const result = rule.onError && rule.onError({value: "not.an.email", key: "field", fields: {}, rules: []});

		expect(result).toBe("field is not an email");
	});
}).tag(["rule", "email"]);
