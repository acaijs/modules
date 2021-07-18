import ColumnOptions from "../../../interfaces/ColumnOptions";
import { ModelContent } from "../../../interfaces/ModelContent";
import QueryClass from "./query";
export default abstract class TableClass<T = Record<string, ModelContent>> extends QueryClass<T> {
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
