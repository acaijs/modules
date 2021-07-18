// Interfaces
import FieldInfoInterface 	from "../interfaces/fieldInfo";
import RelationDataInterface 	from "../interfaces/relationData";

// Parts
import Model from "./Model";

const HasOne = (modelcb:() => typeof Model, foreignKey: string, primaryKey?: string): PropertyDecorator => {
	return (target, key) => {
		const thismodel 	= target.constructor.prototype as { $fields?: FieldInfoInterface[], $relations?: RelationDataInterface[] };
		
		if (!thismodel.$fields) 	thismodel.$fields 		= [];
		if (!thismodel.$relations)	thismodel.$relations 	= [];

		// field that links the two models is in another model, so we don't need to instance it
		thismodel.$fields.push({name: key as string, type: "string", args:{}});

		// add relation
		thismodel.$relations.push({
			model	: modelcb,
			type	: "hasMany",
			name	: key as string,
			foreignKey,
			primaryKey,
		});
	}
}

export default HasOne;