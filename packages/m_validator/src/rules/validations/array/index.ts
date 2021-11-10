// Interfaces
import RuleInterface from "../../../interfaces/rule"

const rule = {
	// callbacks
	onValidate	: ({ value }) 	=> Array.isArray(value),
	onError		: ({ key }) 	=> `${key} is not an array`,
} as RuleInterface

export default rule