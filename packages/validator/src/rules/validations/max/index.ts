// Interfaces
import RuleInterface from "../../../interfaces/rule";

// Classes
import InvalidRuleException from "../../../classes/InvalidRuleException";

const types = {
	array	: (value: unknown, args: string[]) => Array.isArray(value) 		&& value.length <= parseInt(args[0]),
	object	: (value: unknown, args: string[]) => typeof value === "object"	&& Object.keys(value).length <= parseInt(args[0]),
	string	: (value: unknown, args: string[]) => typeof value === "string" && value.length <= parseInt(args[0]),
	number	: (value: unknown, args: string[]) => typeof value === "number" && value <= parseInt(args[0]),
};

const rule = {
	// callbacks
	onValidate	: ({ value, args, rules, key }) => {
		if (!args || args.length !== 1) {
			throw new InvalidRuleException(`Rule 'max' for field ${key} has invalid number of arguments`, {value, args, rules, key});
		}

		if (rules.includes("array"))
			return types.array(value, args);
		else if (rules.includes("string"))
			return types.string(value, args);
		else if (rules.includes("object"))
			return types.object(value, args);
		else if (rules.includes("number"))
			return types.number(value, args);

		return false;
	},
	onError		: ({ rules, value, key, args }) => {
		if (rules.includes("array")) {
			if (!Array.isArray(value)) return `${key} value is not an array`;

			return `${key} has more elements than the allowed: ${args[0]}`;
		}
		if (rules.includes("string")) {
			if (typeof value !== "string") return `${key} value is not a string`;

			return `${key} has more characters than the allowed: ${args[0]}`;
		}
		if (rules.includes("object")) {
			if (typeof value !== "object") return `${key} value is not a object`;

			return `${key} has more keys than the allowed: ${args[0]}`;
		}
		if (rules.includes("number")) {
			if (typeof value !== "number") return `${key} value is not a number`;

			return `${key} is more than the allowed: ${args[0]}`;
		}
	},
} as RuleInterface;

export default rule;