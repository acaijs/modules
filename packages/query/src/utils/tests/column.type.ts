// Packages
import test from "@acai/testing"

// Interfaces
import ColumnOptions from "../../interfaces/ColumnOptions"

// Abstractions
import QueryAbstract from "../../abstractions/builder"
import typeMaps from "../../classes/queryStrategies/sql/helpers/typeMaps"

export default function adapterColumnTypeTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} column type methods`, (context) => {
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

		const testType = (type: ColumnOptions["type"]) => test(`Test field type ${type}`, async (assert) => {
			if (type !== "float") return

			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				field: {
					type: type,
					length: type as any === "enum" ? ["1", "2"] : undefined,
				},
			})

			const table = await adapter.table("test").getColumns()

			assert(table.field.type).toBe(type)
		});

		(Object.keys(typeMaps) as ColumnOptions["type"][]).forEach((type) => testType(type))
	}).tag(["column", "type"])
}