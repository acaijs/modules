// Packages
import test from "@acai/testing";

// Abstractions
import QueryAbstract from "../../abstractions/builder";

export default function adapterRelationUpdateTests (name: string, adapter: typeof QueryAbstract, settings: any) {
	test.group(`Test ${name} column relation update methods`, (context) => {
		// -------------------------------------------------
		// setup
		// -------------------------------------------------
	
		context.beforeEach(async () => {
			await adapter.toggleSettings(settings);

			await adapter.table("base").createTable({
				id: {
					type: "int",
					primary: true,
				},
			});

			await adapter.table("base2").createTable({
				id: {
					type: "int",
					primary: true,
				},
				code: {
					type: "int",
					unique: true,
				},
			});

			await adapter.table("test").createTable({
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base",
					}
				}
			});
		});
	
		context.afterEach(async () => {
			await adapter.table("test").dropTable();
			await adapter.table("base").dropTable();
			await adapter.table("base2").dropTable();
		});
	
		// -------------------------------------------------
		// tests
		// -------------------------------------------------
	
		test("Test field basic constraint name change", async (assert) => {
			adapter.addMigration("test", {
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base",
						name: "customname"
					}
				}
			});

			await adapter.runMigrations();
	
			const table = await adapter.table("test").getColumns();
	
			assert(table.id_base.foreign).toBeDefined();
			assert(table.id_base.foreign?.name).toBe("customname");
			assert(table.id_base.foreign?.table).toBe("base");
			assert(table.id_base.foreign?.column).toBe("id");
		});
	
		test("Test field basic constraint table change", async (assert) => {
			adapter.addMigration("test", {
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base2"
					}
				}
			});

			await adapter.runMigrations();
	
			const table = await adapter.table("test").getColumns();
	
			assert(table.id_base.foreign).toBeDefined();
			assert(table.id_base.foreign?.table).toBe("base2");
			assert(table.id_base.foreign?.column).toBe("id");
		});
	
		test("Test field basic constraint column change", async (assert) => {
			adapter.addMigration("test", {
				id: {
					type: "int",
					primary: true,
				},
				id_base: {
					type: "int",
					foreign: {
						table: "base2",
						column: "code"
					}
				}
			});

			await adapter.runMigrations();
	
			const table = await adapter.table("test").getColumns();
	
			assert(table.id_base.foreign).toBeDefined();
			assert(table.id_base.foreign?.table).toBe("base2");
			assert(table.id_base.foreign?.column).toBe("code");
		});
	}).tag(["column", "relation", "update"]);
}