// Packages
import test from "@acai/testing";

// Strategies
import smartUpdate from "../../helpers/smartUpdate";

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
							type: "string"
						}
					},
					{
						id: {
							type: "string"
						}
					}
				);

				assert(result[0]).toBe("");
			});

			test("Test field type change", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string"
						}
					},
					{
						id: {
							type: "int"
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id int(255) NOT NULL");
				assert(result[1]).toBe("");
			});

			test("Test field length change", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string"
						}
					},
					{
						id: {
							type: "string",
							length: 25,
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(25) NOT NULL");
				assert(result[1]).toBe("");
			});

			// -------------------------------------------------
			// nullable
			// -------------------------------------------------

			test("Test field nullable add", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string"
						}
					},
					{
						id: {
							type: "string",
							nullable: true,
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NULL");
				assert(result[1]).toBe("");
			}).tag("nullable");

			test("Test field nullable remove", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							nullable: true,
						}
					},
					{
						id: {
							type: "string",
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NOT NULL");
				assert(result[1]).toBe("");
			}).tag("nullable");

			// -------------------------------------------------
			// unique
			// -------------------------------------------------

			test("Test field unique add", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string"
						}
					},
					{
						id: {
							type: "string",
							unique: true,
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NOT NULL UNIQUE");
				assert(result[1]).toBe("");
			}).tag("unique");

			test("Test field unique remove", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							unique: true,
						}
					},
					{
						id: {
							type: "string",
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table DROP INDEX id, MODIFY COLUMN id varchar(255) NOT NULL");
				assert(result[1]).toBe("");
			}).tag("unique");

			// -------------------------------------------------
			// autoincrement
			// -------------------------------------------------

			test("Test field autoincrement add", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							primary: true,
						}
					},
					{
						id: {
							type: "string",
							primary: true,
							autoIncrement: true,
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NOT NULL AUTO_INCREMENT");
				assert(result[1]).toBe("");
			}).tag("autoincrement");

			test("Test field autoincrement remove", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							primary: true,
							autoIncrement: true,
						}
					},
					{
						id: {
							type: "string",
							primary: true,
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NOT NULL");
				assert(result[1]).toBe("");
			}).tag("autoincrement");

			// -------------------------------------------------
			// default
			// -------------------------------------------------

			test("Test field default add", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
						}
					},
					{
						id: {
							type: "string",
							default: "test",
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NOT NULL DEFAULT 'test'");
				assert(result[1]).toBe("");
			}).tag("default");

			test("Test field default remove", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							default: "test",
						}
					},
					{
						id: {
							type: "string",
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NOT NULL");
				assert(result[1]).toBe("");
			}).tag("default");

			test("Test field default change", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							default: "test",
						}
					},
					{
						id: {
							type: "string",
							default: "test2",
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table MODIFY COLUMN id varchar(255) NOT NULL DEFAULT 'test2'");
				assert(result[1]).toBe("");
			}).tag("default");

			// -------------------------------------------------
			// primary
			// -------------------------------------------------

			test("Test field primary add", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
						}
					},
					{
						id: {
							type: "string",
							primary: true,
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table ADD PRIMARY KEY (id)");
				assert(result[1]).toBe("");
			}).tag("primary");

			test("Test field primary remove", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							primary: true,
						}
					},
					{
						id: {
							type: "string",
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table DROP PRIMARY KEY");
				assert(result[1]).toBe("");
			}).tag("primary");

			test("Test field primary change", async (assert) => {
				const result = smartUpdate(
					"table",
					{
						id: {
							type: "string",
							primary: true,
						},
						otherid: {
							type: "string",
						}
					},
					{
						id: {
							type: "string",
						},
						otherid: {
							type: "string",
							primary: true,
						}
					}
				);

				assert(result[0]).toBe("ALTER TABLE table DROP PRIMARY KEY, ADD PRIMARY KEY (otherid)");
				assert(result[1]).toBe("");
			}).tag("primary");
		}).tag(["column", "update"]);
	}).tag(["sql", "helper"]);
});