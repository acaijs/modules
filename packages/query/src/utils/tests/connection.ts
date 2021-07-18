// Packages
import test from "@acai/testing";

// Abstractions
import QueryAbstract from "../../abstractions/builder";

export default function adapterConnectionTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} query methods`, (context) => {
		// -------------------------------------------------
		// setup
		// -------------------------------------------------

		context.beforeAll(async () => {
			await adapter.toggleSettings(settings);
		});

		context.beforeEach(async () => {
			await adapter.table("test").createTable({
				id: {
					type			: "int",
					length			: 36,
					autoIncrement	: true,
					primary			: true,
				}
			});
		});

		context.afterEach(async () => {
			await adapter.table("test").dropTable();
		});

		// -------------------------------------------------
		// tests
		// -------------------------------------------------

		test("Test connection successful", async (assert) => {
			const fields = await adapter.table("test").getColumns();

			assert(fields).toBeDefined().toBeTypeOf("object");
			assert(fields.id).toBeDefined().toBeTypeOf("object");
			assert(fields.id.type).toBeDefined().toBeTypeOf("string").toBe("int");
		});
	}).tag(["connection"]);
}