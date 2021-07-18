// Interfaces
import RuleInterface from "../../../interfaces/rule";

const rule = {
	// callbacks
	onValidate	: ({value}) => !!((typeof value === "string") && (value as string).match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)),
	onError		: ({key}) 	=> `${key} is not a valid uuid`,
} as RuleInterface;

export default rule;