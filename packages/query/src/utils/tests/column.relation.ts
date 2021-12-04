// Packages
import test from "@acai/testing"

// Abstractions
import QueryAbstract from "../../abstractions/builder"

export default function adapterColumnRelationTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} column relation methods`, (context) => {
		// -------------------------------------------------
		// setup
		// -------------------------------------------------

		context.beforeAll(async () => {
			await adapter.toggleSettings(settings)
		})

		context.afterEach(async () => {
			await adapter.table("test").dropTable()
			await adapter.table("base").dropTable()
		})

		// -------------------------------------------------
		// tests
		// -------------------------------------------------

		test("Test field basic constraint", async (assert) => {
			await adapter.table("base").createTable({
				id: {
					type: "int",
					primary: true,
				},
			})

			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base",
					},
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.id_base.foreign).toBeDefined()
			assert(table.id_base.foreign?.table).toBe("base")
			assert(table.id_base.foreign?.column).toBe("id")
		})

		test("Test field foreign key cascade on delete", async (assert) => {
			await adapter.table("base").createTable({
				id: {
					type: "int",
					primary: true,
				},
			})

			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base",
						onDelete: "CASCADE",
					},
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.id_base.foreign).toBeDefined()
			assert(table.id_base.foreign?.table).toBe("base")
			assert(table.id_base.foreign?.column).toBe("id")
			assert(table.id_base.foreign?.onDelete).toBe("CASCADE")
		})

		test("Test field foreign key cascade on update", async (assert) => {
			await adapter.table("base").createTable({
				id: {
					type: "int",
					primary: true,
				},
			})

			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base",
						onUpdate: "CASCADE",
					},
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.id_base.foreign).toBeDefined()
			assert(table.id_base.foreign?.table).toBe("base")
			assert(table.id_base.foreign?.column).toBe("id")
			assert(table.id_base.foreign?.onUpdate).toBe("CASCADE")
		})

		test("Test field foreign key cascade on update and delete", async (assert) => {
			await adapter.table("base").createTable({
				id: {
					type: "int",
					primary: true,
				},
			})

			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base",
						onUpdate: "CASCADE",
						onDelete: "CASCADE",
					},
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.id_base.foreign).toBeDefined()
			assert(table.id_base.foreign?.table).toBe("base")
			assert(table.id_base.foreign?.column).toBe("id")
			assert(table.id_base.foreign?.onUpdate).toBe("CASCADE")
			assert(table.id_base.foreign?.onDelete).toBe("CASCADE")
		})
	}).tag(["column", "relation"])
}