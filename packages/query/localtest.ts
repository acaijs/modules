import Sql from "./src/classes/queryStrategies/PostgreSQL";

async function main () {
	await Sql.toggleSettings({
		user		: "root",
		password	: "",
		database	: "acai_query",
		host		: "127.0.0.1",
		port		: 5432,
	});

	Sql.addMigration("test", {
		id: {
			type			: "int",
			length			: 36,
			autoIncrement	: true,
			primary			: true,
		},
		hash: {
			type			: "int",
			length			: 36,
		},
		label: {
			type: "string",
		},
		description: {
			type	: "text",
			nullable: true,
		},
	});

	Sql.addMigration("test2", {
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
		test_link: {
			type	: "int",
			length	: 36,
			foreign	: {
				name: "randomname",
				table: "test",
				column: "id",
				onDelete: "CASCADE"
			}
		},
		label: {
			type: "string",
			default: "hi",
		},
		description: {
			type	: "text",
			nullable: true,
		},
	});

	try {
		await Sql.runMigrations();
	}
	catch (e) {
		console.log(e);
	}

	console.log(await Sql.table("test2").getColumns());

	// await Sql.table("test2").dropTable();
	// await Sql.table("test").dropTable();
	await Sql.close();
}

main();