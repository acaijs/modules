// Packages
import { DateTime } from "luxon";

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toDate = ({value}) => {
	if (DateTime.isDateTime(value))
		return value;
	if (typeof value === "string")
		return DateTime.fromISO(value);
	if (typeof value === "number")
		return DateTime.fromMillis(value);
	if (value instanceof Date)
		return DateTime.fromJSDate(value);
		
	return value;
};

const toSerializeDate = ({value, args}) => {
	const format = DateTime.isDateTime(value) ? value : DateTime.fromJSDate(value);

	if (args) {
		if (args.format) {
			return format.toFormat(args.format);
		}
	}
		
	return format.toISOTime();
};

const timeType = {
	type: {
		type: "time",
	},
	onCreate	: toDate,
	onRetrieve	: toDate,
	onSave		: toSerializeDate,
	onSerialize	: toSerializeDate,
} as ModelTypeInterface;

export default timeType;