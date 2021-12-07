// Packages
import test from "@acai/testing"

// Abstractions
import QueryAbstract from "../../abstractions/builder"

export default function adapterUpdateTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} update query methods`, (context) => {
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

		test("Test single update", async (assert) => {
			await adapter.table("test").where("id", 1).update({
				label: "Joe Doe",
			})

			const response = await adapter.table("test").where("id", 1).first()

			assert(response?.label).toBe("Joe Doe")
		})

		test("Test multiple update", async (assert) => {
			await adapter.table("test").where("id", 1).orWhere("id", 2).update({
				description: "multiple update test",
			})

			const response = await adapter.table("test").where("id", 1).orWhere("id", 2).get()

			assert(response.length).toBe(2)
			assert(response[0].description).toBe("multiple update test")
			assert(response[1].description).toBe("multiple update test")
		})

		test("Test update without where", async (assert) => {
			await adapter.table("test").update({
				description: "all update test",
			})

			const response = await adapter.table("test").get()

			assert(response.length).toBe(3)
			assert(response[0].description).toBe("all update test")
			assert(response[1].description).toBe("all update test")
			assert(response[2].description).toBe("all update test")
		})
	}).tag("update")
}