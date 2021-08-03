// Interfaces
import ColumnOptions from "../../../../interfaces/ColumnOptions"

// Parts
import typeMaps from "./typeMaps"

export default function columnSerialize (key: string, data: ColumnOptions) {
	const length = data.length !== undefined ? data.length : ["string", "float", "int"].indexOf(data.type) + 1 > 0 ? 255: undefined
	const column	: Array<string> = []
	const constraint: Array<string> = []

	// -------------------------------------------------
	// create column
	// -------------------------------------------------

	// column name
	column.push(key)
	// column type and length/enum args
	column.push(`${typeMaps[data.type].toLowerCase()}${length ? `(${length})`:""}`)
	// column nullable
	column.push(data.nullable ? "NULL":"NOT NULL")
	// column unique
	if (data.unique) 		column.push("UNIQUE")
	// column auto increment
	if (data.autoIncrement) column.push("AUTO_INCREMENT")
	// column default
	if (data.default) 		column.push(`DEFAULT ${(typeof data.default === "string" ? `'${data.default}'`:data.default)}`)

	// -------------------------------------------------
	// create constraint
	// -------------------------------------------------

	if (data.foreign) {
		// field name
		constraint.push(`FOREIGN KEY (${ key })`)
		// foreign table
		constraint.push(`REFERENCES ${data.foreign.table}`)
		// foreign table primary key
		constraint.push(`(${ data.foreign.column || "id" })`)
		// on update method
		if (data.foreign.onUpdate) constraint.push(`ON UPDATE ${data.foreign.onUpdate}`)
		// on delete method
		if (data.foreign.onDelete) constraint.push(`ON DELETE ${data.foreign.onDelete}`)
	}

	return [column.join(" "), constraint.join(" ") || undefined] as [string, string | undefined]
}