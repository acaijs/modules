// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toSid = ({value, args, key, model}) => {
	// field is not primary key, should not auto generate
	if (model.$primary !== key) return value

	if (value !== undefined && value !== null && args.nullable !== true)
		return `${value}`
	else
		return Math.random().toString(36).substring(2, 2 + (args?.length || 11))
}

const sidType = {
	onCreate	: toSid,
	onUpdate	: toSid,
	onSave		: toSid,
	onRetrieve	: toSid,
} as ModelTypeInterface

export default sidType