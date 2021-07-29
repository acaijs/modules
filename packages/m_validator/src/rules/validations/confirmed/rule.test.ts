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
			field: ["confirmed"]
		};
	}
}

test.group("Confirmation rule tests", () => {
	// -------------------------------------------------
	// Validator tests
	// -------------------------------------------------

	test("Get rule from validator", (expect) => {
		const validator = new TestValidator({field: 1});
		const required 	= validator.rules.confirmed;

		expect(required).toBeDefined();
		expect(required.onError).toBeDefined();
		expect(required.onValidate).toBeDefined();
	});

	// -------------------------------------------------
	// Validator rule tests
	// -------------------------------------------------

	test("Test success rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "test", field_confirmation: "test"});

		expect(validator.errors).toBeUndefined();
		expect(validator.validated.field).toBe("test");
	});

	test("Test fail rule through validator", (expect) => {
		const validator = TestValidator.validate({field: "not.confirmed"});

		expect(validator.errors).toBeDefined();
		expect(validator.validated.field).toBeUndefined();
		expect((validator.errors as {errors: Record<string, string[]>}).errors.field).toBe(["field is not confirmed"]);
	});

	// -------------------------------------------------
	// Direct rule tests
	// -------------------------------------------------

	test("Test success rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "test", key: "field", fields: {field: "test", field_confirmation: "test"}, rules: []});

		expect(result).toBe(true);
	});

	test("Test fail rule directly", (expect) => {
		const result = rule.onValidate && rule.onValidate({value: "not.confirmed", key: "field", fields: {field: "test", field_confirmation: "testhi"}, rules: []});

		expect(result).toBe(false);
	});

	test("Test fail rule message directly", (expect) => {
		const result = rule.onError && rule.onError({value: "not.confirmed", key: "field", fields: {}, rules: []});

		expect(result).toBe("field is not confirmed");
	});
}).tag(["rule", "confirmed"]);
