// Interfaces
import RuleInterface from "../../../interfaces/rule"

const rule = {
	// callbacks
	onValidate : ({value, args}) => {
		if ((args && args.includes("force") && !isNaN(value as number)) || typeof value === "number") {
			return parseFloat(value as string) === parseInt(value as string)
		}

		return false
	},
	onMask	: ({value}) => parseFloat(value as string),
	onError : ({key}) => `${key} is not an integer`,
} as RuleInterface

export default rule