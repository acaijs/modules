// Packages
import test from "@acai/testing"

// Abstractions
import QueryAbstract from "../../abstractions/builder"

export default function adapterTransactionTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} transaction methods`, (context) => {
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
		})

		context.afterEach(async () => {
			await adapter.table("test").dropTable()
		})

		// -------------------------------------------------
		// tests
		// -------------------------------------------------

		test("Test to not have a rollback when error is not thrown inside of transact", async (assert) => {
			try {
				await adapter.transact(async () => {
					await adapter.table("test").insert({
						email		: "joe.doe@email.com",
						label		: "Joe Doe",
						description	: "Father of John Doe",
					})
				})
			}
			catch (e) {}

			const fields = await adapter.table("test").first()

			assert(fields).toBeDefined()
		})

		test("Test rollback when error is thrown inside of transact", async (assert) => {
			try {
				await adapter.transact(async () => {
					await adapter.table("test").insert({
						email		: "joe.doe@email.com",
						label		: "Joe Doe",
						description	: "Father of John Doe",
					})

					throw new Error("Test error")
				})
			}
			catch (e) {}

			const fields = await adapter.table("test").first()

			assert(fields).toBeUndefined()
		})

		test("Test rollback when query error is thrown inside of transact", async (assert) => {
			try {
				await adapter.transact(async () => {
					await adapter.table("test").insert({
						email		: "joe.doe@email.com",
						label		: "Joe Doe",
						description	: "Father of John Doe",
					})

					await adapter.table("test").insert({
						id			: "should be a int",
						email		: "joe.doe@email.com",
						label		: "Joe Doe",
						description	: "Father of John Doe",
					})
				})
			}
			catch (e) {}

			const fields = await adapter.table("test").first()

			assert(fields).toBeUndefined()
		})
	}).tag(["transaction"])
}