// -------------------------------------------------
// Exports
// -------------------------------------------------

// Base abstract query
export {default as AbstractQuery} 	from "./abstractions/builder"

// Implementations
export {default as SqlQuery} 		from "./classes/queryStrategies/sql"

// -------------------------------------------------
// Connection handling
// -------------------------------------------------

import dictionary from "./utils/dictionary"
export * from "./utils/dictionary"
export default dictionary