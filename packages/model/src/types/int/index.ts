// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toInt = ({value, args}) => {
	if (args?.nullable && (value === null || value === undefined)) return null

	const format = parseInt(value)

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