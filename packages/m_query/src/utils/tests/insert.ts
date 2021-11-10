// Packages
import test from "@acai/testing"

// Abstractions
import QueryAbstract from "../../abstractions/builder"

export default function adapterInsertTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} insert query methods`, (context) => {
		// -------------------------------------------------
		// setup
		// -------------------------------------------------

		context.beforeAll(async () => {
			await adapter.toggleSettings(settings)
		})

		context.beforeEach(async () => {
			await adapter.table("test").createTable({
				id: {
					type			: "int",
					length			: 36,
					autoIncrement	: true,
					primary			: true,
				},
				email: {
					type	: "string",
					unique	: true,
					length	: 50,
				},
				label: {
					type: "string",
				},
				description: {
					type	: "string",
					nullable: true,
				},
			})

			await adapter.table("test").insert({email: "john.doe@email.com", 	label: "John Doe"})
			await adapter.table("test").insert({email: "mary.doe@email.com", 	label: "Mary Doe"})
			await adapter.table("test").insert({email: "junior.doe@email.com", 	label: "Junior Doe", description: "Son of John and Mary Doe"})
		})

		context.afterEach(async () => {
			await adapter.table("test").dropTable()
		})

		// -------------------------------------------------
		// tests
		// -------------------------------------------------

		test("Test simple insert", async (assert) => {
			const fields = await adapter.table("test").insert({
				email		: "joe.doe@email.com",
				label		: "Joe Doe",
				description	: "Father of John Doe",
			})

			assert(fields).toBeDefined()
		})
	}).tag(["insert"])
}