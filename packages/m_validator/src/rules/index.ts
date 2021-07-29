// Interfaces
import RuleInterface from "../interfaces/rule";

// Validation rules
import arrayRule 		from "./validations/array";
import confirmedRule 	from "./validations/confirmed";
import emailRule 		from "./validations/email";
import uuidRule 		from "./validations/uuid";
import objectRule 		from "./validations/object";
import requiredRule 	from "./validations/required";
import stringRule 		from "./validations/string";
import numberRule 		from "./validations/number";
import inRule			from "./validations/in";
import notInRule		from "./validations/notIn";
import integerRule		from "./validations/integer";
import truthyRule		from "./validations/truthy";
import minRule			from "./validations/min";
import maxRule			from "./validations/max";
import regexRule		from "./validations/regex";
import dateRule			from "./validations/date";

// list
let ruleList: Record<string, RuleInterface> = {
	// general
	"confirmed"	: confirmedRule,
	"required"	: requiredRule,
	"truthy"	: truthyRule,

	// string
	"email"		: emailRule,
	"uuid"		: uuidRule,
	"regex"		: regexRule,
	"date"		: dateRule,

	// composite
	"in"		: inRule,
	"notIn"		: notInRule,
	"min"		: minRule,
	"max"		: maxRule,

	// type
	"object"	: objectRule,
	"string"	: stringRule,
	"array"		: arrayRule,
	"number"	: numberRule,

	// number
	"float"		: numberRule,
	"integer"	: integerRule,
	"int"		: integerRule,
};

// methods
export function setRule(name: string, rule: RuleInterface) {
	ruleList[name] = rule;
}

export function setRules(rules: Record<string, RuleInterface>) {
	Object.keys(rules).forEach(name => {
		ruleList[name] = rules[name];
	});
}

export function clearRules() {
	ruleList = {};
}

// default
export default () => ruleList;