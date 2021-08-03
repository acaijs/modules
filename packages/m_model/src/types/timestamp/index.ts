// Packages
import { DateTime } from "luxon"

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toDate = ({value}) => {
	if (DateTime.isDateTime(value))
		return value
	if (typeof value === "string")
		return DateTime.fromSeconds(parseInt(value))
	if (typeof value === "number")
		return DateTime.fromMillis(value)
	if (value instanceof Date)
		return DateTime.fromJSDate(value)

	return value
}

const toSerializeDate = ({value}) => {
	if (value) {
		const format = DateTime.isDateTime(value) ? value : DateTime.fromJSDate(value)

		return format.toFormat("yyyy-LL-dd HH:mm:ss")
	}
}

const timestampType = {
	type: {
		type: "timestamp",
	},
	onCreate	: toDate,
	onRetrieve	: toDate,
	onSave		: toSerializeDate,
	onSerialize	: toSerializeDate,
} as ModelTypeInterface

export default timestampType