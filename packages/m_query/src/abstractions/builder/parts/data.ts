// Interfaces
import { ModelContent } 	from "../../../interfaces/ModelContent";

// Parts
import StaticClass from "./static";

export default abstract class DataClass<T = Record<string, ModelContent>> extends StaticClass<T> {

	// -------------------------------------------------
	// data methods
	// -------------------------------------------------

	public raw = async (query: string, params: unknown[] = []) => {
		return await this.getAdapter().raw(query, params);
	}

	public count = async (column?: string) => {
		return await this.getAdapter().count(
			this.tableName,
			column || "*",
			this.queryBuild.logic.length > 0 ? this.queryBuild : undefined,
		);
	}

	public avg = async (column: string) => {
		return await this.getAdapter().avg(
			this.tableName,
			column,
			this.queryBuild.logic.length > 0 ? this.queryBuild : undefined,
		);
	}

	public sum = async (column: string) => {
		return await this.getAdapter().sum(
			this.tableName,
			column,
			this.queryBuild.logic.length > 0 ? this.queryBuild : undefined,
		);
	}
}