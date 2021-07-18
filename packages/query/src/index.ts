// -------------------------------------------------
// Imports
// -------------------------------------------------

import AbstractQuery 	from "./abstractions/builder";
import SqlQuery 		from "./classes/queryStrategies/sql";
import PgQuery 			from "./classes/queryStrategies/sql";

// interfaces
import ModelContent from "./interfaces/ModelContent";

// -------------------------------------------------
// Configurations
// -------------------------------------------------

const queries = {} as Record<string, typeof AbstractQuery>;

export async function addQuery (name: string, type: string, config?: Record<string, ModelContent>) {
	switch (type) {
		case "sql":
		case "mysql":
		case "mysqli":
			queries[name] = SqlQuery;
			break;
		case "pg":
		case "postgres":
		case "postgresql":
			queries[name] = PgQuery;
			break;
	}

	if (config) {
		await queries[name].toggleSettings(config);
	}

	return queries[name];
}

export async function setDefault(name:string, config?: Record<string, ModelContent>) {
	return await addQuery("default", name, config);
}

// -------------------------------------------------
// Exports
// -------------------------------------------------

// Base abstract query
export {default as AbstractQuery} 	from "./abstractions/builder";

// Implementations
export {default as SqlQuery} 		from "./classes/queryStrategies/sql";

// default query
export default (key?: string): typeof AbstractQuery => queries[key || "default"];