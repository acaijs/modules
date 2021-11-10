// Interfaces
import AbstractQuery 		from "../interface"
import QueryStrategy 		from "../../../interfaces/queryStrategy"
import { ModelContent } 	from "../../../interfaces/ModelContent"

// Parts
import Properties from "./properties"

export default abstract class StaticClass<T = Record<string, ModelContent>> extends Properties<T> {
	// -------------------------------------------------
	// static methods
	// -------------------------------------------------

	public static async toggleAdapter (adapter: QueryStrategy, settings?: Record<string, ModelContent>) {
		this.adapter = new (adapter as any)()
		if (settings) this.settings = settings

		return await this.adapter.build(this.settings)
	}

	public static async toggleSettings (settings: Record<string, ModelContent>) {
		this.settings = settings

		return await this.adapter.build(this.settings)
	}

	public static async isConnected () {
		return await this.adapter.isConnected()
	}

	public static async hasErrors () {
		return await this.adapter.hasErrors()
	}

	public static async close () {
		await this.adapter.close()
	}

	public static table<model = Record<string, ModelContent>> (table: string) {
		const query = new (this as any)()

		query.table(table)

		return query as AbstractQuery<model>
	}
}