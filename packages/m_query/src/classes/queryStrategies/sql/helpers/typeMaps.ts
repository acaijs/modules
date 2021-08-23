// -------------------------------------------------
// Serialize column data
// -------------------------------------------------

const typeMaps = {
	string: "VARCHAR",
	text: "TEXT",
	int: "INT",
	float: "FLOAT",
	boolean: "TINYINT",
	date: "DATE",
	datetime: "DATETIME",
	timestamp: "TIMESTAMP",
	json: "JSON",
	enum: "ENUM",
} as const

export default typeMaps