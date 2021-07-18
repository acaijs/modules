// Interfaces
import ColumnOptions 	from "../../../interfaces/ColumnOptions";
import { ModelContent } from "../../../interfaces/ModelContent";

// Parts
import TransactionClass from "./transaction";

export default abstract class MigrationClass<T = Record<string, ModelContent>> extends TransactionClass<T> {
	// -------------------------------------------------
	// migration methods
	// -------------------------------------------------
	
	public static addMigration (table: string, columns: Record<string, ColumnOptions>) {
		this.adapter.addMigration(table, columns);
	}
	
	public static async runMigrations () {
		await this.adapter.runMigrations();
	}
}