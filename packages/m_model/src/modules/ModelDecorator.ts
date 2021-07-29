// Modules
import Model from "./Model";

const models = [] as typeof Model[];

const ModelDecorator = (table: string, primary = "id"): ClassDecorator => {
	return (target) => {
		const model 	= target as unknown as typeof Model;
		model.$table 	= table;
		model.$primary	= primary;

		models.push(model);
	};
}

export default ModelDecorator;

export const getModels = () => models;