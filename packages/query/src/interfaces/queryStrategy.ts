
// Interfaces
import QueryPart 			from "./QueryPart";
import ModelContent 		from "./ModelContent";
import ColumnOptions 		from "./ColumnOptions";
import JoinClauseInterface 	from "./JoinClause";

export default interface QueryStrategy {
	// adapter
	close (): void;
	build (settings: Record<string, ModelContent>): Promise<void | any>;
	isConnected (): boolean;
	hasErrors (): any | false;

	// general
	raw		(query: string, params?: unknown[])						: Promise<any>;
	count 	(table: string, column: string, condition?: QueryPart) 	: Promise<number>;
	sum 	(table: string, column: string, condition?: QueryPart) 	: Promise<number>;
	avg 	(table: string, column: string, condition?: QueryPart) 	: Promise<number>;

	// table
	existsTable											(table: string)																	: Promise<boolean>;
	createTable		<T = Record<string, ModelContent>>	(table: string, fields: Record<keyof T, ColumnOptions>)							: Promise<boolean>;
	getColumns		<T = Record<string, ModelContent>>	(table: string, fields?: (keyof T | "*")[])										: Promise<Record<string, ColumnOptions>>;
	alterTable		<T = Record<string, ModelContent>>	(table: string, fields: Record<keyof T, ColumnOptions>, smartUpdate?: boolean)	: Promise<boolean>;
	dropTable											(table: string)																	: Promise<boolean>;
	
	// migration
	addMigration <T = Record<string, ModelContent>> (table: string, fields: Record<keyof T, ColumnOptions>)	: void;
	runMigrations									()														: Promise<void>;

	// transaction
	startTransaction 		(name?: string)	: Promise<void>;
	commitTransaction		(name?: string)	: Promise<void>;
	rollbackTransaction		(name?: string)	: Promise<void>;
	savepointTransaction 	(name: string)	: Promise<void>;
	releaseTransaction 		(name: string)	: Promise<void>;

	// query
	queryAdd		<T = Record<string, ModelContent>>	(table: string, fields: T)									: Promise<string | number>;
	queryUpdate		<T = Record<string, ModelContent>>	(table: string, fields: Partial<T>, condition: QueryPart)	: Promise<string | number>;
	queryDelete											(table: string, condition: QueryPart)						: Promise<number>;

	// select
	querySelect		<T = Record<string, ModelContent>>	(
		table: string,
		fields?: (keyof T | "*")[],
		condition?: QueryPart,
		limit?: number,
		offset?: number,
		orderBy?: {order?: "ASC" | "DESC", by: string},
		joinClause?: JoinClauseInterface,
		groupBy?: string
	)	: Promise<T[]>;
}