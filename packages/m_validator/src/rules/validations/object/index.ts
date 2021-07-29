// Interfaces
import RuleInterface from "../../../interfaces/rule";

const rule = {
	// callbacks
	onValidate	: ({value}) => typeof value === "object",
	onError		: ({key}) 	=> `${key} is not an object`,
} as RuleInterface;

export default rule;