// Packages
import test from "@acai/testing"

// Modules
import Validator from "."

// concrete validator class
class TestValidator extends Validator {
	public getSchema() {
		return {
			field: [],
		} as const
	}
}

test.group("Validator tests", () => {
	test("Validator instancing", (expect) => {
		const validator = TestValidator.validate({field:1})

		expect(validator).toBeDefined()
		expect(validator.fields).toBeDefined().toBe({field:1})
	})

	test("Validator delivers only validated fields", (expect) => {
		const validator = TestValidator.validate({field:1, test: 2})

		expect(validator.validated).toBeDefined()
		expect(validator.validated.field).toBeDefined().toBe(1)
		expect((validator.validated as any).test).toBeUndefined()
	})
}).tag(["validator"])
