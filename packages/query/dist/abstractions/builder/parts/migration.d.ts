import ColumnOptions from "../../../interfaces/ColumnOptions";
import { ModelContent } from "../../../interfaces/ModelContent";
import TransactionClass from "./transaction";
export default abstract class MigrationClass<T = Record<string, ModelContent>> extends TransactionClass<T> {
    static addMigration(table: string, columns: Record<string, ColumnOptions>): void;
    static runMigrations(): Promise<void>;
}
