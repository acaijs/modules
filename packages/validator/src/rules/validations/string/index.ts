// Interfaces
import RuleInterface from "../../../interfaces/rule";

const rule = {
	// callbacks
	onValidate	: ({value}) => typeof value === "string",
	onError		: ({key}) 	=> `${key} is not a string`,
} as RuleInterface;

export default rule;