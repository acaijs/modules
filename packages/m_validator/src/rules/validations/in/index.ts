// Interfaces
import RuleInterface from "../../../interfaces/rule"

// Classes
import InvalidRuleException from "../../../classes/InvalidRuleException"

const types = {
	array	: (value: unknown, args: string[]) => Array.isArray(value) 		&& args.find(a => (value as string[]).find(v => v === a)),
	string	: (value: unknown, args: string[]) => typeof value === "string" && args.find(a => a === value),
	object	: (value: unknown, args: string[]) => typeof value === "object" && args.find(a => value && Object.keys(value).find(v => v === a)),
	number	: (value: unknown, args: string[]) => typeof value === "number" && args.find(a => a === `${value}`),
}

const rule = {
	// callbacks
	onValidate	: ({ value, args, rules, key }) => {
		if (!args || args.length === 0) {
			throw new InvalidRuleException(`Rule 'in' for field ${key} has invalid number of arguments`, {value, args, rules, key})
		}

		if (rules.includes("array"))
			return types.array(value, args)
		else if (rules.includes("string"))
			return types.string(value, args)
		else if (rules.includes("object"))
			return types.object(value, args)
		else if (rules.includes("number"))
			return types.number(value, args)

		return false
	},
	onError		: ({ rules, value, key, args }) => {
		if (rules.includes("array")) {
			if (!Array.isArray(value)) return `${key} value is not an array`

			return `${key} does not include one of the values: ${(args || []).join(", ")}`
		}
		if (rules.includes("string")) {
			if (typeof value !== "string") return `${key} value is not a string`

			return `${key} does not include one of the values: ${(args || []).join(", ")}`
		}
		if (rules.includes("object")) {
			if (typeof value !== "object") return `${key} value is not a object`

			return `${key} does not include one of the values: ${(args || []).join(", ")}`
		}
		if (rules.includes("number")) {
			if (typeof value !== "number") return `${key} value is not a number`

			return `${key} does not include one of the values: ${(args || []).join(", ")}`
		}
	},
} as RuleInterface

export default rule