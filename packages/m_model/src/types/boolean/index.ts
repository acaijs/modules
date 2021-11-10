// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toBoolean = ({value}) => {
	return !!value
}

const toDatabaseBoolean = ({value}) => {
	return value ? 1:0
}

const booleanType = {
	type: {
		type: "int",
	},
	onSave		: toDatabaseBoolean,
	onCreate	: toBoolean,
	onRetrieve	: toBoolean,
	onSerialize	: toBoolean,
} as ModelTypeInterface

export default booleanType