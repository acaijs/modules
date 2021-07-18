// Interfaces
import RuleInterface from "../../../interfaces/rule";

const rule = {
	// callbacks
	onValidate	: ({value}) => !!value,
	onError		: ({key}) 	=> `${key} is required`,
} as RuleInterface;

export default rule;