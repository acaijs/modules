// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toJson = ({value}) => {
	if (typeof value === "string")
		return JSON.parse(value)
	if (value === undefined)
		return {}

	return value
}

const jsonType = {
	type: {
		type: "json",
	},
	onSerialize	: toJson,
	onCreate	: toJson,
	onUpdate	: toJson,
	onSave		: ({value}) => value ? JSON.stringify(value) : value,
	onRetrieve	: toJson,
} as ModelTypeInterface

export default jsonType