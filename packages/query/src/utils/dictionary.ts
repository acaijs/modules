// -------------------------------------------------
// Imports
// -------------------------------------------------

import MigrationClass 	from "../abstractions/builder"
import SqlQuery 		from "../classes/queryStrategies/sql"

// interfaces
import type ModelContent from "../interfaces/ModelContent"

const queries = {} as Record<string, typeof MigrationClass>

export async function addQuery (name: string, type: string, config?: Record<string, ModelContent>) {
	switch (type) {
		case "sql":
		case "mysql":
		case "mysqli":
			queries[name] = SqlQuery
			break
	}

	if (config) {
		await queries[name].toggleSettings(config)
	}

	return queries[name]
}

export async function setDefault(name:string, config?: Record<string, ModelContent>) {
	return await addQuery("default", name, config)
}

// default query
export default (key?: string): typeof MigrationClass => queries[key || "default"]