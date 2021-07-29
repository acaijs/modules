// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toString = ({value, args}) => {
	const format = (value === undefined || value === null) ? "":`${value}`;

	if (args) {
		if (args.max && args.max < format.length)
			return format.substring(0, args.max);
	}

	return format;
};

const textType = {
	type: {
		type: "text",
	},
	onCreate	: toString,
	onUpdate	: toString,
	onSave		: toString,
	onRetrieve	: toString,
} as ModelTypeInterface;

export default textType;