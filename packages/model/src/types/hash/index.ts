// Packages
import config from "@acai/config";

// Interfaces
import ModelTypeInterface from "../../interfaces/modelType";

// Utils
import Hasher from "../../utils/Hasher";

const hashType = {
	onCreate	: ({value}) => {
		if (typeof value === "string") {
			const salt = config ? config.getConfig("APP_KEY", undefined):undefined;

			const hash = new Hasher(undefined, salt || 10);
			hash.hash(value);

			return hash;
		}

		return value;
	},
	onSave	: ({value}) => {
		if (!value) return value;

		if (value.toString)
			return value.toString();

		return `${value}`;
	},
	onRetrieve	: ({value}) => {
		return new Hasher(value as string);
	},
	onSerialize	: ({value}) => {
		if (value.toString)
			return value.toString();

		return `${value}`;
	},
} as ModelTypeInterface;

export default hashType;