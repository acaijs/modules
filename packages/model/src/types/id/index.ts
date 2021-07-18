// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

const toInt = ({value}) => {
	const format = parseInt(value);
		
	return format;
};

const idType = {
	type: {
		type: "int",
		length: 21,
	},

	onCreate	: toInt,
	onUpdate	: toInt,
	onSave		: toInt,
	onRetrieve	: toInt,
} as ModelTypeInterface;

export default idType;