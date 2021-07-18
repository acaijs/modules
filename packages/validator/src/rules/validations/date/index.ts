// Packages
import { DateTime } from "luxon";

// Interfaces
import RuleInterface from "../../../interfaces/rule";

const rule = {
	// callbacks
	onValidate	: ({ value, args })	=> {
		if (args && args[0])
			return DateTime.fromFormat(value as string, args[0]).isValid;
		
		return DateTime.fromISO(value as string).isValid;
	},
	onError		: ({ key }) 	=> `${key} is not a valid date`,
} as RuleInterface;

export default rule;