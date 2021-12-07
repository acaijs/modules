// Packages
import test from "@acai/testing"

// Abstractions
import QueryAbstract from "../../abstractions/builder"

export default function adapterColumnTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} column methods`, (context) => {
		// -------------------------------------------------
		// setup
		// -------------------------------------------------

		context.beforeAll(async () => {
			await adapter.toggleSettings(settings)
		})

		context.afterEach(async () => {
			await adapter.table("test").dropTable()
		})

		// -------------------------------------------------
		// tests
		// -------------------------------------------------

		test("Test create table", async (assert) => {
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

			const table = await adapter.table("test").getColumns()

			assert(table).toBeDefined()
			assert(table.id).toBeDefined()
			assert(table.email).toBeDefined()
			assert(table.label).toBeDefined()
			assert(table.description).toBeDefined()
		})

		test("Test field length", async (assert) => {
			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				field: {
					type	: "string",
					length	: 36,
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.field.length).toBe(36)
		})

		test("Test field auto increment", async (assert) => {
			await adapter.table("test").createTable({
				field: {
					type			: "int",
					autoIncrement	: true,
					primary			: true,
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.field.autoIncrement).toBe(true)
		})

		test("Test field primary", async (assert) => {
			await adapter.table("test").createTable({
				field: {
					type	: "int",
					primary	: true,
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.field.primary).toBe(true)
		})

		test("Test field unique", async (assert) => {
			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				field: {
					type	: "int",
					unique	: true,
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.field.unique).toBe(true)
		})

		test("Test field nullable", async (assert) => {
			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				field: {
					type		: "int",
					nullable	: true,
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.field.nullable).toBe(true)
		})

		test("Test field default value", async (assert) => {
			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				field: {
					type	: "int",
					default	: 10,
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.field.default).toBe(10)
		})
	}).tag(["column"])
}