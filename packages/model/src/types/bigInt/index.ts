// Interfaces
import ModelTypeInterface from "../../interfaces/modelType"

const toInt = ({value, args}) => {
	const format = parseInt(value)

	if (args) {
		if (args.max && args.max < format)
			return args.max
		if (args.min && args.min > format)
			return args.min
	}

	return format
}

const bigIntType = {
	type: {
		type: "bigint",
	},

	onCreate	: toInt,
	onUpdate	: toInt,
	onSave		: toInt,
	onRetrieve	: toInt,
} as ModelTypeInterface

export default bigIntType