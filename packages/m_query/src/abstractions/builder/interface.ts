// Interfaces
import GenericModelContent, { ModelContent } 	from "../../interfaces/ModelContent"
import QueryPart 								from "../../interfaces/QueryPart"
import QueryComparison 							from "../../interfaces/QueryComparison"
import PaginatedResponse 						from "../../interfaces/PaginatedResponse"
import ColumnOptions from "../../interfaces/ColumnOptions"

export default interface AbstractQuery<ModelGeneralOverwrite = Record<string, ModelContent>> {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;
	orWhere (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;
	limit (value: number, offset?: number): AbstractQuery;
	orderBy (by: string, order?: "ASC" | "DESC"): AbstractQuery;
	groupBy (column: string): AbstractQuery;
	fields <ModelConfig = ModelGeneralOverwrite>(fields: (keyof ModelConfig | "*")[]): AbstractQuery;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	rawQueryObject (): QueryPart;

	// -------------------------------------------------
	// table methods
	// -------------------------------------------------

	getColumns <ModelConfig = ModelGeneralOverwrite> 		(fields?: (keyof ModelConfig | "*")[]) 	: Promise<Record<string, ColumnOptions>>;
	createTable 	(columns: Record<string, ColumnOptions>)										: Promise<void>;
	alterTable 		(columns: Record<string, ColumnOptions>)										: Promise<void>;
	dropTable 		()																				: Promise<void>;
	existsTable 	()																				: Promise<boolean>;

	// -------------------------------------------------
	// join methods
	// -------------------------------------------------

	join 		(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	leftJoin 	(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	rightJoin 	(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	innerJoin 	(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;
	joinType 	(type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery;

	// -------------------------------------------------
	// data methods
	// -------------------------------------------------

	raw 	(query: string)			: any;
	avg 	(columnName: string)	: Promise<number>;
	sum 	(columnName: string)	: Promise<number>;
	count 	(columnName?: string)	: Promise<number>;
	parseResult <ModelConfig = ModelGeneralOverwrite> (cb: (result: ModelConfig | ModelConfig[]) => unknown): AbstractQuery;

	// -------------------------------------------------
	// retrieve methods
	// -------------------------------------------------

	get 		<ModelConfig = ModelGeneralOverwrite> (fields?: (keyof ModelConfig | "*")[]) 	: Promise<ModelConfig[]>;
	first 		<ModelConfig = ModelGeneralOverwrite> (fields?: (keyof ModelConfig | "*")[]) 	: Promise<ModelConfig | undefined>;
	last 		<ModelConfig = ModelGeneralOverwrite> (fields?: (keyof ModelConfig | "*")[]) 	: Promise<ModelConfig | undefined>;
	paginate 	<ModelConfig = ModelGeneralOverwrite> (page?: number, perPage?: number) 		: Promise<PaginatedResponse<ModelConfig>>;

	// -------------------------------------------------
	// crud methods
	// -------------------------------------------------
	insert <T = ModelGeneralOverwrite>	(fields: T) 			: Promise<number | string>;
	update <T = ModelGeneralOverwrite>	(fields: Partial<T>) 	: Promise<number | string>;
	delete 								() 						: Promise<number>;
}