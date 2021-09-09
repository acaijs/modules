// Interfaces
import GenericModelContent, { ModelContent } 	from "../../interfaces/ModelContent"
import QueryPart 								from "../../interfaces/QueryPart"
import QueryComparison 							from "../../interfaces/QueryComparison"
import PaginatedResponse 						from "../../interfaces/PaginatedResponse"
import ColumnOptions from "../../interfaces/ColumnOptions"

export default interface AbstractQuery<ModelGeneralOverwrite = Record<string, ModelContent>, FieldArg = (keyof ModelGeneralOverwrite)[] | "*" | keyof ModelGeneralOverwrite> {
	// -------------------------------------------------
	// query methods
	// -------------------------------------------------

	where (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;
	orWhere (arg1: string | [string, QueryComparison, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): AbstractQuery;
	limit (value: number, offset?: number): AbstractQuery;
	orderBy (by: string, order?: "ASC" | "DESC"): AbstractQuery;
	groupBy (column: string): AbstractQuery;
	fields (fields: FieldArg): AbstractQuery;

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	toString (): string;
	rawQueryObject (): QueryPart;

	// -------------------------------------------------
	// table methods
	// -------------------------------------------------

	getColumns (fields?: FieldArg): Promise<Record<string, ColumnOptions>>;
	createTable (columns: Record<string, ColumnOptions>): Promise<void>;
	alterTable (columns: Record<string, ColumnOptions>): Promise<void>;
	dropTable (): Promise<void>;
	existsTable (): Promise<boolean>;

	// -------------------------------------------------
	// join methods
	// -------------------------------------------------

	join (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
	leftJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
	rightJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
	innerJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
	joinType (type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;

	// -------------------------------------------------
	// data methods
	// -------------------------------------------------

	raw (query: string): any;
	avg (columnName: string): Promise<number>;
	sum (columnName: string): Promise<number>;
	count (columnName?: string): Promise<number>;
	parseResult <ModelConfig = ModelGeneralOverwrite> (cb: (result: ModelConfig | ModelConfig[]) => unknown): AbstractQuery;

	// -------------------------------------------------
	// retrieve methods
	// -------------------------------------------------

	get (fields?: FieldArg): Promise<ModelGeneralOverwrite[]>;
	first (fields?: FieldArg): Promise<ModelGeneralOverwrite | undefined>;
	last (fields?: FieldArg): Promise<ModelGeneralOverwrite | undefined>;
	paginate (page?: number, perPage?: number): Promise<PaginatedResponse<ModelGeneralOverwrite>>;

	// -------------------------------------------------
	// crud methods
	// -------------------------------------------------
	insert (fields: ModelGeneralOverwrite): Promise<number | string>;
	update (fields: Partial<ModelGeneralOverwrite>): Promise<number | string>;
	delete (): Promise<number>;
}