// Interfaces
import RuleInterface from "../../../interfaces/rule";

const rule = {
	// callbacks
	onValidate	: ({value}) => !!((typeof value === "string") && (value as string).match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
	onError		: ({key}) 	=> `${key} is not an email`,
} as RuleInterface;

export default rule;