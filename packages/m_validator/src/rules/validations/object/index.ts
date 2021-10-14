// Interfaces
import RuleInterface from "../../../interfaces/rule";

const rule = {
	// callbacks
	/**
	 * typeof [] === 'object' returns true
	 */
	onValidate	: ({value}) => typeof value === "object",
	onError		: ({key}) 	=> `${key} is not an object`,
} as RuleInterface;

export default rule;
