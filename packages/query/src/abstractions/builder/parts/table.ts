// Interfaces
import ColumnOptions 	from "../../../interfaces/ColumnOptions";
import { ModelContent } from "../../../interfaces/ModelContent";

// Parts
import QueryClass from "./query";

export default abstract class TableClass<T = Record<string, ModelContent>> extends QueryClass<T> {
	// -------------------------------------------------
	// table methods
	// -------------------------------------------------
	
	public getColumns = async <ModelConfig = T>() => {
		const result = await this.getAdapter().getColumns<ModelConfig>(this.tableName);
		return result;
	}

	public async createTable (columns: Record<string, ColumnOptions>) {
		return await this.getAdapter().createTable(this.tableName, columns);
	}

	public async alterTable (columns: Record<string, ColumnOptions & {action: "ADD" | "ALTER" | "DELETE", after?: string, before?: string}>) {
		return await this.getAdapter().alterTable(this.tableName, columns);
	}

	public async dropTable () {
		return await this.getAdapter().dropTable(this.tableName);
	}

	public async existsTable () {
		return await this.getAdapter().existsTable(this.tableName);
	}
}