// Packages
import * as Client from "mysql2";
// -------------------------------------------------
// Serialize column data
// -------------------------------------------------
declare const typeMaps: {
    readonly string: "VARCHAR";
    readonly text: "TEXT";
    readonly int: "INT";
    readonly float: "FLOAT";
    readonly boolean: "TINYINT";
    readonly date: "DATE";
    readonly datetime: "DATETIME";
    readonly timestamp: "TIMESTAMP";
    readonly json: "JSON";
    readonly enum: "ENUM";
};
type constraintTypes = "RESTRICT" | "SET NULL" | "CASCADE" | "NO ACTION";
interface ColumnOptions {
    type: keyof typeof typeMaps;
    length?: number | string[];
    autoIncrement?: boolean;
    nullable?: boolean;
    unique?: boolean;
    primary?: boolean;
    default?: unknown;
    foreign?: {
        name?: string;
        table: string;
        column?: string;
        onUpdate?: constraintTypes;
        onDelete?: constraintTypes;
    };
}
type ModelContent = string | boolean | number | undefined;
type QueryComparison = "=" | "!=" | "<" | "<=" | ">" | ">=" | "LIKE" | "like";
interface PaginatedResponse<ModelConfig = Record<string, ModelContent>> {
    data: ModelConfig[];
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
}
type GenericModelContent$0 = ModelContent;
interface QueryPart {
    type: "and" | "or";
    logic: (string | number | unknown | QueryPart)[];
}
interface AbstractQuery<ModelGeneralOverwrite = Record<string, ModelContent>, FieldArg = (keyof ModelGeneralOverwrite)[] | "*" | keyof ModelGeneralOverwrite> {
    // -------------------------------------------------
    // query methods
    // -------------------------------------------------
    where(arg1: string | [string, QueryComparison, GenericModelContent$0?][], arg2?: QueryComparison | GenericModelContent$0, arg3?: GenericModelContent$0): AbstractQuery;
    orWhere(arg1: string | [string, QueryComparison, GenericModelContent$0?][], arg2?: QueryComparison | GenericModelContent$0, arg3?: GenericModelContent$0): AbstractQuery;
    limit(value: number, offset?: number): AbstractQuery;
    orderBy(by: string, order?: "ASC" | "DESC"): AbstractQuery;
    groupBy(column: string): AbstractQuery;
    fields(fields: FieldArg): AbstractQuery;
    // -------------------------------------------------
    // debug methods
    // -------------------------------------------------
    toString(): string;
    rawQueryObject(): QueryPart;
    // -------------------------------------------------
    // table methods
    // -------------------------------------------------
    getColumns(fields?: FieldArg): Promise<Record<string, ColumnOptions>>;
    createTable(columns: Record<string, ColumnOptions>): Promise<void>;
    alterTable(columns: Record<string, ColumnOptions>): Promise<void>;
    dropTable(): Promise<void>;
    existsTable(): Promise<boolean>;
    // -------------------------------------------------
    // join methods
    // -------------------------------------------------
    join(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
    leftJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
    rightJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
    innerJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
    joinType(type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): AbstractQuery<ModelGeneralOverwrite>;
    // -------------------------------------------------
    // data methods
    // -------------------------------------------------
    raw(query: string): any;
    avg(columnName: string): Promise<number>;
    sum(columnName: string): Promise<number>;
    count(columnName?: string): Promise<number>;
    parseResult<ModelConfig = ModelGeneralOverwrite>(cb: (result: ModelConfig | ModelConfig[]) => unknown): AbstractQuery;
    // -------------------------------------------------
    // retrieve methods
    // -------------------------------------------------
    get(fields?: FieldArg): Promise<ModelGeneralOverwrite[]>;
    first(fields?: FieldArg): Promise<ModelGeneralOverwrite | undefined>;
    last(fields?: FieldArg): Promise<ModelGeneralOverwrite | undefined>;
    paginate(page?: number, perPage?: number): Promise<PaginatedResponse<ModelGeneralOverwrite>>;
    // -------------------------------------------------
    // crud methods
    // -------------------------------------------------
    insert(fields: ModelGeneralOverwrite): Promise<number | string>;
    update(fields: Partial<ModelGeneralOverwrite>): Promise<number | string>;
    delete(): Promise<number>;
}
interface JoinClauseInterface {
    type: "inner" | "left" | "right" | "outer";
    table: string;
    firstColumn: string;
    secondColumn: string;
    operator: string;
}
interface QueryStrategy {
    // adapter
    close(): void;
    build(settings: Record<string, ModelContent>): Promise<void | any>;
    isConnected(): boolean;
    hasErrors(): any | false;
    // general
    raw(query: string, params?: unknown[]): Promise<any>;
    count(table: string, column: string, condition?: QueryPart): Promise<number>;
    sum(table: string, column: string, condition?: QueryPart): Promise<number>;
    avg(table: string, column: string, condition?: QueryPart): Promise<number>;
    // table
    existsTable(table: string): Promise<boolean>;
    createTable<T = Record<string, ModelContent>>(table: string, fields: Record<keyof T, ColumnOptions>): Promise<boolean>;
    getColumns<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[] | "*" | keyof T): Promise<Record<string, ColumnOptions>>;
    alterTable<T = Record<string, ModelContent>>(table: string, fields: Record<keyof T, ColumnOptions>, smartUpdate?: boolean): Promise<boolean>;
    dropTable(table: string): Promise<boolean>;
    // migration
    addMigration<T = Record<string, ModelContent>>(table: string, fields: Record<keyof T, ColumnOptions>): void;
    runMigrations(): Promise<void>;
    // transaction
    startTransaction(name?: string): Promise<void>;
    commitTransaction(name?: string): Promise<void>;
    rollbackTransaction(name?: string): Promise<void>;
    savepointTransaction(name: string): Promise<void>;
    releaseTransaction(name: string): Promise<void>;
    // query
    queryAdd<T = Record<string, ModelContent>>(table: string, fields: T): Promise<string | number>;
    queryUpdate<T = Record<string, ModelContent>>(table: string, fields: Partial<T>, condition: QueryPart): Promise<string | number>;
    queryDelete(table: string, condition: QueryPart): Promise<number>;
    // select
    querySelect<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[] | "*" | keyof T, condition?: QueryPart, limit?: number, offset?: number, orderBy?: {
        order?: "ASC" | "DESC";
        by: string;
    }, joinClause?: JoinClauseInterface, groupBy?: string): Promise<T[]>;
}
type GenericModelContent$1 = ModelContent;
declare abstract class Properties<T = Record<string, ModelContent>> {
    // -------------------------------------------------
    // properties
    // -------------------------------------------------
    protected tableName: string;
    protected queryBuild: QueryPart;
    protected orderByQuery?: {
        order?: "ASC" | "DESC";
        by: string;
    };
    protected offsetQuantity?: number;
    protected limitQuantity?: number;
    protected fieldsList?: string[];
    protected joinList?: JoinClauseInterface;
    protected groupByColumn?: string;
    protected parseResultCache?: (result: any | any[]) => unknown;
    protected static adapter: QueryStrategy;
    protected static settings: Record<string, ModelContent>;
    // -------------------------------------------------
    // debug methods
    // -------------------------------------------------
    rawQueryObject: () => QueryPart;
    // -------------------------------------------------
    // helper methods
    // -------------------------------------------------
    protected getAdapter(): QueryStrategy;
    protected push(type: "and" | "or", subqueries: unknown[]): void;
    protected buildQueryPart: <ModelConfig = T>(arg1: keyof ModelConfig | [keyof ModelConfig, string | number | boolean | undefined, GenericModelContent$1?][], arg2?: QueryComparison | GenericModelContent$1, arg3?: GenericModelContent$1) => [string, string, ModelContent][];
}
declare abstract class StaticClass<T = Record<string, ModelContent>> extends Properties<T> {
    // -------------------------------------------------
    // static methods
    // -------------------------------------------------
    static toggleAdapter(adapter: QueryStrategy, settings?: Record<string, ModelContent>): Promise<any>;
    static toggleSettings(settings: Record<string, ModelContent>): Promise<any>;
    static isConnected(): Promise<boolean>;
    static hasErrors(): Promise<any>;
    static close(): Promise<void>;
    static table<model = Record<string, ModelContent>>(table: string): AbstractQuery<model, "*" | keyof model | (keyof model)[]>;
}
declare abstract class DataClass<T = Record<string, ModelContent>> extends StaticClass<T> {
    // -------------------------------------------------
    // data methods
    // -------------------------------------------------
    raw: (query: string, params?: unknown[]) => Promise<any>;
    count: (column?: string | undefined) => Promise<number>;
    avg: (column: string) => Promise<number>;
    sum: (column: string) => Promise<number>;
}
declare abstract class JoinClass<T = Record<string, ModelContent>> extends DataClass<T> {
    // -------------------------------------------------
    // join methods
    // -------------------------------------------------
    joinType(type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    join(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    leftJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    rightJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    innerJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
}
declare abstract class QueryClass<T = Record<string, ModelContent>> extends JoinClass<T> {
    // -------------------------------------------------
    // query methods
    // -------------------------------------------------
    table: (table: string) => this;
    where: (arg1: string | [string, QueryComparison, GenericModelContent$1?][], arg2?: QueryComparison | GenericModelContent$1, arg3?: GenericModelContent$1) => this;
    orWhere: (arg1: string | [string, QueryComparison, GenericModelContent$1?][], arg2?: QueryComparison | GenericModelContent$1, arg3?: GenericModelContent$1) => this;
    whereNull: (field: string) => this;
    whereNotNull: (field: string) => this;
    orWhereNull: (field: string) => this;
    orWhereNotNull: (field: string) => this;
    whereIn: (field: string, values: any[]) => this;
    whereNotIn: (field: string, values: any[]) => this;
    orWhereIn: (field: string, values: any[]) => this;
    orWhereNotIn: (field: string, values: any[]) => this;
    orderBy: (by: string, order?: "ASC" | "DESC" | undefined) => this;
    limit: (quantity: number, offset?: number | undefined) => this;
    groupBy: (column: string) => this;
    fields: <ModelConfig = T>(fields: ("*" | keyof ModelConfig)[]) => this;
    parseResult: <ModelConfig = T>(cb: (result: ModelConfig | ModelConfig[]) => unknown) => this;
    // -------------------------------------------------
    // get methods
    // -------------------------------------------------
    first: <ModelConfig = T>() => Promise<ModelConfig | undefined>;
    last: <ModelConfig = T>(fields?: "*" | keyof ModelConfig | (keyof ModelConfig)[]) => Promise<ModelConfig | undefined>;
    get: <ModelConfig = T>(fields?: "*" | keyof ModelConfig | (keyof ModelConfig)[] | undefined) => Promise<ModelConfig[]>;
    paginate: <ModelConfig = T>(page?: string | number | undefined, perPage?: number | string) => Promise<PaginatedResponse<ModelConfig>>;
    // -------------------------------------------------
    // manipulation methods
    // -------------------------------------------------
    insert: <ModelConfig = T>(fields: ModelConfig) => Promise<string | number>;
    insertMany: <ModelConfig = T>(rows: ModelConfig[]) => Promise<(string | number)[]>;
    update: <ModelConfig = T>(fields: ModelConfig) => Promise<string | number>;
    updateMany: <ModelConfig = T>(rows: ModelConfig[]) => Promise<(string | number)[]>;
    delete: () => Promise<number>;
}
declare abstract class TableClass<T = Record<string, ModelContent>> extends QueryClass<T> {
    // -------------------------------------------------
    // table methods
    // -------------------------------------------------
    getColumns: <ModelConfig = T>() => Promise<Record<string, ColumnOptions>>;
    createTable(columns: Record<string, ColumnOptions>): Promise<boolean>;
    alterTable(columns: Record<string, ColumnOptions & {
        action: "ADD" | "ALTER" | "DELETE";
        after?: string;
        before?: string;
    }>): Promise<boolean>;
    dropTable(): Promise<boolean>;
    existsTable(): Promise<boolean>;
}
declare abstract class TransactionClass<T = Record<string, ModelContent>> extends TableClass<T> {
    // -------------------------------------------------
    // Static methods
    // -------------------------------------------------
    static transact(callback: (config: any) => Promise<void>): Promise<void>;
    static startTransaction(): Promise<void>;
    static savepointTransaction(name: string): Promise<void>;
    static releaseTransaction(name: string): Promise<void>;
    static rollbackTransaction(): Promise<void>;
    static commitTransaction(): Promise<void>;
    // Instance methods
    // -------------------------------------------------
    transact(callback: (config: any) => Promise<void>): Promise<void>;
    startTransaction(): Promise<void>;
    savepointTransaction(name: string): Promise<void>;
    releaseTransaction(name: string): Promise<void>;
    rollbackTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
}
declare abstract class MigrationClass<T = Record<string, ModelContent>> extends TransactionClass<T> {
    // -------------------------------------------------
    // migration methods
    // -------------------------------------------------
    static addMigration(table: string, columns: Record<string, ColumnOptions>): void;
    static runMigrations(): Promise<void>;
}
declare module MigrationClassWrapper {
    export { MigrationClass };
}
import QueryAbstract = MigrationClassWrapper.MigrationClass;
interface SettingsConfigInterface extends Record<string, string | number | undefined> {
    hostname: string;
    username: string;
    db: string;
    poolSize?: number;
    password: string;
}
type queryStrategy = QueryStrategy;
declare class SqlStrategy implements queryStrategy {
    // -------------------------------------------------
    // Properties
    // -------------------------------------------------
    protected migrations: Record<string, Record<string, ColumnOptions>>;
    protected client: Client.Connection;
    protected connected: boolean;
    protected errors: any;
    // -------------------------------------------------
    // Client methods
    // -------------------------------------------------
    close(): Promise<void>;
    build(settings: Record<string, unknown>): Promise<unknown>;
    isConnected(): boolean;
    hasErrors(): any;
    // -------------------------------------------------
    // Data methods
    // -------------------------------------------------
    raw(query: string, params?: unknown[]): Promise<any>;
    sum(table: string, column: string, condition?: QueryPart): Promise<any>;
    avg(table: string, column: string, condition?: QueryPart): Promise<any>;
    count(table: string, column: string, condition?: QueryPart): Promise<number>;
    // -------------------------------------------------
    // Table methods
    // -------------------------------------------------
    existsTable(table: string): Promise<boolean>;
    getColumns(table: string): Promise<Record<string, ColumnOptions>>;
    createTable<T = Record<string, ModelContent>>(table: string, fields: Record<keyof T, ColumnOptions>): Promise<boolean>;
    alterTable<T = Record<string, ModelContent>>(table: string, fields: Record<keyof T, ColumnOptions & {
        action: "ADD" | "ALTER" | "DELETE";
        after?: string;
        before?: string;
    }>): Promise<boolean>;
    dropTable(table: string): Promise<boolean>;
    // -------------------------------------------------
    // migration methods
    // -------------------------------------------------
    addMigration(table: string, columns: Record<string, ColumnOptions>): void;
    runMigrations(): Promise<void>;
    // -------------------------------------------------
    // Transact methods
    // -------------------------------------------------
    startTransaction(): Promise<void>;
    savepointTransaction(name: string): Promise<void>;
    releaseTransaction(name: string): Promise<void>;
    rollbackTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    // -------------------------------------------------
    // CRUD methods
    // -------------------------------------------------
    querySelect<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[], condition?: QueryPart, limit?: number, offset?: number, orderBy?: {
        order?: "ASC" | "DESC";
        by: string;
    }, joinClause?: JoinClauseInterface, groupBy?: string): Promise<any>;
    queryAdd<T = Record<string, ModelContent>>(table: string, fields: Partial<T>): Promise<any>;
    queryUpdate<T = Record<string, ModelContent>>(table: string, fields: Partial<T>, condition?: QueryPart): Promise<any>;
    queryDelete(table: string, condition?: QueryPart): Promise<any>;
}
declare module SqlStrategyWrapper {
    export { SqlStrategy };
}
import strategy = SqlStrategyWrapper.SqlStrategy;
declare class SqlQuery extends QueryAbstract {
    protected static adapter: strategy;
    protected static settings: SettingsConfigInterface;
}
declare function addQuery(name: string, type: string, config?: Record<string, ModelContent>): Promise<typeof MigrationClass>;
declare function setDefault(name: string, config?: Record<string, ModelContent>): Promise<typeof MigrationClass>;
declare const _default: (key?: string | undefined) => typeof MigrationClass;
declare const dictionary: typeof _default;
export { dictionary as default, MigrationClass as AbstractQuery, SqlQuery, PaginatedResponse, addQuery, setDefault, _default };
