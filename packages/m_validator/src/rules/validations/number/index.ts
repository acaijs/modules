// Interfaces
import RuleInterface from "../../../interfaces/rule"

const rule = {
	// callbacks
	onValidate : ({value, args}) => {
		if (args && args.includes("force")) return !isNaN(value as number)

		return typeof value === "number"
	},
	onMask	: ({value}) => parseFloat(value as string),
	onError : ({key}) => `${key} is not a number`,
} as RuleInterface

export default rule