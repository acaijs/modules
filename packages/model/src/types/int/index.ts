// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toInt = ({value, args}) => {
	const format = value ? parseInt(value) : args.nullable !== true ? 0 : value

	if (!format && format !== 0) return format

	if (args) {
		if (args.max && args.max < format)
			return args.max
		if (args.min && args.min > format)
			return args.min
	}

	return format
}

const intType = {
	type: {
		type: "int",
	},

	onCreate	: toInt,
	onUpdate	: toInt,
	onSave		: toInt,
	onRetrieve	: toInt,
} as ModelTypeInterface

export default intType