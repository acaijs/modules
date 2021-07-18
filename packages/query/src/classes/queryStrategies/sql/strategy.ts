// Packages
import * as Client from "mysql2";

// Interfaces
import ModelContent 		from "../../../interfaces/ModelContent";
import QueryPart 			from "../../../interfaces/QueryPart";
import queryStrategy 		from "../../../interfaces/queryStrategy";
import ColumnOptions 		from "../../../interfaces/ColumnOptions";
import JoinClauseInterface 	from "../../../interfaces/JoinClause";

// Helpers
import { tableDeserialize, columnSerialize, joinClauseBuilder, queryResolver, resolveQueryPart, smartUpdate } from "./helpers";

class SqlStrategy implements queryStrategy {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected migrations: Record<string, Record<string, ColumnOptions>> = {};
	protected client 	= {} as Client.Connection;
	protected connected = false;
	protected errors: any;

	// -------------------------------------------------
	// Client methods
	// -------------------------------------------------

	public async close () {
		if (this.client && this.client.end) await this.client.end();
	}

	public async build (settings: Record<string, unknown>) {
		await this.close();
		this.client = await Client.createConnection(settings);
		return new Promise(r => {
			this.client.connect((err) => {
				this.errors 	= err;
				this.connected 	= !err;

				return r(err || false);
			});
		});
	}

	public isConnected () {
		return this.connected;
	}

	public hasErrors () {
		return this.errors || false;
	}

	// -------------------------------------------------
	// Data methods
	// -------------------------------------------------

	public async raw (query: string, params: unknown[] = []) {
		return await queryResolver(this.client, query, params);
	}

	public async sum (table: string, column: string, condition?: QueryPart) {
		const stringcondition = condition && resolveQueryPart(condition);
		
		return await queryResolver(
			this.client,
			`SELECT SUM(${column}) FROM ${table}${ stringcondition ? ` WHERE ${stringcondition[0]}`:"" }`,
			stringcondition && stringcondition[1],
		);
	}

	public async avg (table: string, column: string, condition?: QueryPart) {
		const stringcondition = condition && resolveQueryPart(condition);
		
		return await queryResolver(
			this.client,
			`SELECT AVG(${column}) FROM ${table}${ stringcondition ? ` WHERE ${stringcondition[0]}`:"" }`,
			stringcondition && stringcondition[1],
		);
	}

	public async count (table: string, column: string, condition?: QueryPart) {
		const stringcondition = condition && resolveQueryPart(condition);
		
		return Object.values((await queryResolver(
			this.client,
			`SELECT COUNT(${column}) FROM ${table}${ stringcondition ? ` WHERE ${stringcondition[0]}`:"" }`,
			stringcondition && stringcondition[1],
		))[0])[0] as number;
	}

	// -------------------------------------------------
	// Table methods
	// -------------------------------------------------

	public async existsTable (table: string) {
		const query = (await queryResolver(
			this.client,
			"SHOW TABLES",
		));

		return !!query.find(i => Object.values(i)[0] === table);
	}

	public async getColumns (table: string) {
		const query = (await queryResolver(
			this.client,
			`SHOW CREATE TABLE ${table}`,
		));

		if (query.length === 0)
			return {};

		return tableDeserialize(query[0]["Create Table"]);
	}

	public async createTable<T = Record<string, ModelContent>> (table: string, fields: Record<keyof T, ColumnOptions>) {
		const key = Object.keys(fields).find(k => fields[k].primary);
		const columns = [] as string[];
		const foreign = [] as string[];

		// build columns
		Object.keys(fields).map(key => {
			const column = columnSerialize(key, fields[key]);

			columns.push(column[0] as string);

			if (column[1]) foreign.push(column[1]);
		});

		await queryResolver(
			this.client,
			`CREATE TABLE ${table} (${
				columns.join(", ")
			}${
				key ? `,PRIMARY KEY (${key})`:""
			}${
				foreign.length > 0 ? `, ${foreign.join(", ")}`:""
			})`,
		);

		return true;
	}

	public async alterTable<T = Record<string, ModelContent>> (table: string, fields: Record<keyof T, ColumnOptions & {action: "ADD" | "ALTER" | "DELETE", after?: string, before?: string}>) {
		const key = Object.keys(fields).find(k => fields[k].primary);
		const columns = [] as string[];
		const foreign = [] as string[];

		// build columns
		Object.keys(fields).map(key => {
			const column = columnSerialize(key, fields[key]);
			const type = fields[key].action === "ALTER" ? "MODIFY COLUMN": fields[key].action  === "DELETE" ? "DROP COLUMN":"ADD";

			if (type === "DROP COLUMN")
				columns.push(`${type} ${key}`);
			else
				columns.push(`${type} ${column[0]}${fields[key].before ? ` BEFORE ${fields[key].before}`:""}${fields[key].after ? ` AFTER ${fields[key].after}`:""}`);

			if (column[1]) foreign.push(column[1]);
		});

		await queryResolver(
			this.client,
			`ALTER TABLE ${table} (${
				columns.join(", ")
			}${
				key ? `,PRIMARY KEY (${key})`:""
			}${
				foreign.length > 0 ? `, ${foreign.join(", ")}`:""
			})`,
		);

		return true;
	}

	public async dropTable (table: string) {
		await queryResolver(
			this.client,
			`DROP TABLE IF EXISTS ${table}`,
		);

		return true;
	}

	// -------------------------------------------------
	// migration methods
	// -------------------------------------------------

	public addMigration (table: string, columns: Record<string, ColumnOptions>) {
		this.migrations[table] = columns;
	}

	public async runMigrations () {
		// data
		const columns 		= [] as string[];
		const constraints 	= [] as string[];

		// disable foreign key constraint
		await queryResolver(this.client, "SET FOREIGN_KEY_CHECKS=0;");

		// gather all migrations
		await Promise.all(Object.keys(this.migrations).map(tableName => {
			const c = async () => {
				const updatedtable 	= this.migrations[tableName];
				
				// update table
				if (await this.existsTable(tableName)) {
					const oldtable 					= await this.getColumns(tableName);	
					const [_columns, _constraints] 	= smartUpdate(tableName, oldtable, updatedtable);

					columns.push(_columns);
					constraints.push(_constraints);
				}
				// create table
				else {
					const key = Object.keys(updatedtable).find(k => updatedtable[k].primary);
					const _columns 	= [] as string[];
					const foreign 	= [] as string[];
			
					Object.keys(updatedtable).map(key => {
						const column = columnSerialize(key, updatedtable[key]);
			
						_columns.push(column[0] as string);
			
						if (column[1]) foreign.push(column[1]);
					});

					columns.push(
						`CREATE TABLE ${tableName} (${
							_columns.join(", ")
						}${
							key ? `,PRIMARY KEY (${key})`:""
						})`
					);

					constraints.push(`ALTER TABLE ${tableName} ${
						foreign.map(i => `ADD ${i}`).join(", ")
					}`);
				}
			}

			return c();
		}));

		// run migrations
		for (let i = 0; i < columns.length; i++) {
			if (columns[i])
				await queryResolver(this.client, columns[i]);
		}
		for (let i = 0; i < constraints.length; i++) {
			if (constraints[i])
				await queryResolver(this.client, constraints[i]);
		}

		// reenable foreign key constraint
		await queryResolver(this.client, "SET FOREIGN_KEY_CHECKS=1;");

		// dump all the tables after finishing
		this.migrations = {};
	}

	// -------------------------------------------------
	// Transact methods
	// -------------------------------------------------

	public async startTransaction () {
		await queryResolver(this.client, "START TRANSACTION");
	}

	public async savepointTransaction (name: string) {
		await queryResolver(this.client, `SAVEPOINT ${name}`);
	}

	public async releaseTransaction (name: string) {
		await queryResolver(this.client, `RELEASE SAVEPOINT ${name}`);
	}

	public async rollbackTransaction () {
		await queryResolver(this.client, "ROLLBACK");
	}

	public async commitTransaction () {
		await queryResolver(this.client, "COMMIT");
	}

	// -------------------------------------------------
	// CRUD methods
	// -------------------------------------------------

	public async querySelect<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[], condition?: QueryPart, limit?: number, offset?: number, orderBy?: {order?: "ASC" | "DESC", by: string}, joinClause?: JoinClauseInterface, groupBy?: string) {
		const stringcondition 	= condition && resolveQueryPart(condition);

		return await queryResolver(
			this.client,
			`SELECT ${
				(fields && fields.length > 0) ? fields.join(", "):"*"
			} FROM ${
				table
			}${
				stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}`:""
			}${
				groupBy ? ` GROUP BY ${groupBy}`:""
			}${
				orderBy ? ` ORDER BY ${orderBy.by} ${orderBy.order || "ASC"}`:""
			}${
				limit ? ` LIMIT ${limit}`:""
			}${ offset ? ` OFFSET ${offset}`:""}${
				joinClause ? joinClauseBuilder(joinClause):""
			}`,
			stringcondition && stringcondition[1]
		);
	}

	public async queryAdd<T = Record<string, ModelContent>>(table: string, fields: Partial<T>) {		
		const response = await queryResolver(
			this.client,
			`INSERT INTO ${table}(${Object.keys(fields).join(", ")}) VALUES (${Object.values(fields).map(() => "?").join(", ")})`,
			Object.values(fields),
		);

		return response.insertId;
	}

	public async queryUpdate<T = Record<string, ModelContent>>(table: string, fields: Partial<T>, condition?: QueryPart) {
		const values 			= Object.keys(fields).map((key) => `${key} = ?`);
		const stringcondition 	= condition && resolveQueryPart(condition);
		const query				= await queryResolver(
			this.client,
			`UPDATE ${table} SET ${values}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}`:""}`,
			[...Object.values(fields), ...((stringcondition && stringcondition[1]) || [])],
		);

		return query.affectedRows;
	}

	public async queryDelete(table: string, condition?: QueryPart) {
		const stringcondition 	= condition && resolveQueryPart(condition);
		const query				= await queryResolver(
			this.client,
			`DELETE FROM ${table}${stringcondition && stringcondition[0] ? ` WHERE ${stringcondition[0]}`:""}`,
			(stringcondition && stringcondition[1]),
		);

		return query as any;
	}
}

export default SqlStrategy;