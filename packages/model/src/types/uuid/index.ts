// Packages
import { v4 as uuid } from "uuid"

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toUuid = ({value, key, args, model}) => {
	// field is not primary key, should not auto generate
	if (model.$primary !== key) return value

	if ((value === undefined || value === null || value === "") && args.nullable !== true)
		return uuid()

	return value
}

const uuidType = {
	type: {
		type: "string",
		length: 36,
	},
	onCreate	: toUuid,
	onUpdate	: toUuid,
	onSave		: toUuid,
	onRetrieve	: toUuid,
} as ModelTypeInterface

export default uuidType