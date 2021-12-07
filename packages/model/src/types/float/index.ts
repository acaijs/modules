// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toFloat = ({value, args}) => {
	const format = parseFloat(value)

	if (args) {
		if (args.max && args.max < format)
			return args.max
		if (args.min && args.min > format)
			return args.min
	}

	return format
}

const floatType = {
	type: {
		type: "float",
		length: 53,
	},

	onCreate	: toFloat,
	onUpdate	: toFloat,
	onSave		: toFloat,
	onRetrieve	: toFloat,
} as ModelTypeInterface

export default floatType