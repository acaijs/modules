// Packages
import test from "@acai/testing"

// Strategies
import smartUpdate from "../../helpers/smartUpdate"

test.group("sql tests", () => {
	test.group("helper tests", () => {
		test.group("Test sql column update methods", () => {
			// -------------------------------------------------
			// tests
			// -------------------------------------------------

			test("Test nothing to change", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							foreign: {
								table: "foreign_table",
								column: "test",
							},
						},
					},
					{
						id: {
							type: "string",
							foreign: {
								table: "foreign_table",
								column: "test",
							},
						},
					},
				)

				assert(result[1]).toBe("")
			})

			// -------------------------------------------------
			// name related
			// -------------------------------------------------

			test("Test custom name change", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							foreign: {
								table: "foreign_table",
								name: "test2",
							},
						},
					},
					{
						id: {
							type: "string",
							foreign: {
								table: "foreign_table",
								name: "test",
							},
						},
					},
				)

				assert(result[1]).toBe("ALTER TABLE table DROP FOREIGN KEY test2, ADD CONSTRAINT test FOREIGN KEY (id) REFERENCES foreign_table (id)")
			})

			test("Test change without name", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							foreign: {
								table: "foreign_table",
								name: "test2",
							},
						},
					},
					{
						id: {
							type: "string",
							foreign: {
								table: "foreign_table",
							},
						},
					},
				)

				assert(result[1]).toBe("ALTER TABLE table DROP FOREIGN KEY test2, ADD FOREIGN KEY (id) REFERENCES foreign_table (id)")
			})
		}).tag(["foreign", "update"])
	}).tag(["sql", "helper"])
})