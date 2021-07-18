import * as Client from "mysql2";
import ModelContent from "../../../interfaces/ModelContent";
import QueryPart from "../../../interfaces/QueryPart";
import queryStrategy from "../../../interfaces/queryStrategy";
import ColumnOptions from "../../../interfaces/ColumnOptions";
import JoinClauseInterface from "../../../interfaces/JoinClause";
declare class SqlStrategy implements queryStrategy {
    protected migrations: Record<string, Record<string, ColumnOptions>>;
    protected client: Client.Connection;
    protected connected: boolean;
    protected errors: any;
    close(): Promise<void>;
    build(settings: Record<string, unknown>): Promise<unknown>;
    isConnected(): boolean;
    hasErrors(): any;
    raw(query: string, params?: unknown[]): Promise<any>;
    sum(table: string, column: string, condition?: QueryPart): Promise<any>;
    avg(table: string, column: string, condition?: QueryPart): Promise<any>;
    count(table: string, column: string, condition?: QueryPart): Promise<number>;
    existsTable(table: string): Promise<boolean>;
    getColumns(table: string): Promise<Record<string, ColumnOptions>>;
    createTable<T = Record<string, ModelContent>>(table: string, fields: Record<keyof T, ColumnOptions>): Promise<boolean>;
    alterTable<T = Record<string, ModelContent>>(table: string, fields: Record<keyof T, ColumnOptions & {
        action: "ADD" | "ALTER" | "DELETE";
        after?: string;
        before?: string;
    }>): Promise<boolean>;
    dropTable(table: string): Promise<boolean>;
    addMigration(table: string, columns: Record<string, ColumnOptions>): void;
    runMigrations(): Promise<void>;
    startTransaction(): Promise<void>;
    savepointTransaction(name: string): Promise<void>;
    releaseTransaction(name: string): Promise<void>;
    rollbackTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    querySelect<T = Record<string, ModelContent>>(table: string, fields?: (keyof T)[], condition?: QueryPart, limit?: number, offset?: number, orderBy?: {
        order?: "ASC" | "DESC";
        by: string;
    }, joinClause?: JoinClauseInterface, groupBy?: string): Promise<any>;
    queryAdd<T = Record<string, ModelContent>>(table: string, fields: Partial<T>): Promise<any>;
    queryUpdate<T = Record<string, ModelContent>>(table: string, fields: Partial<T>, condition?: QueryPart): Promise<any>;
    queryDelete(table: string, condition?: QueryPart): Promise<any>;
}
export default SqlStrategy;
