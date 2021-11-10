// Interfaces
import FieldInfoInterface 	from "../interfaces/fieldInfo"
import RelationDataInterface 	from "../interfaces/relationData"

// Parts
import Model from "./Model"

const BelongsTo = (modelcb:() => typeof Model, foreignKey: string, primaryKey?: string): PropertyDecorator => {
	return (target, key) => {
		const thismodel 	= target.constructor.prototype as { $fields?: FieldInfoInterface[]; $relations?: RelationDataInterface[] }

		if (!thismodel.$fields) 	thismodel.$fields 		= []
		if (!thismodel.$relations)	thismodel.$relations 	= []

		const extraargs = {} as Record<string, string | boolean>
		if (foreignKey.match(/^\w+\?/)) extraargs.nullable 	= true
		if (foreignKey.match(/^\w+!/))	extraargs.unique 	= true

		// add field that will store the relation data
		thismodel.$fields.push({name: key as string, type: "string", args:extraargs})

		// add relation
		thismodel.$relations.push({
			model		: modelcb,
			type		: "belongsTo",
			name		: key as string,
			foreignKey	: (foreignKey.match(/^\w+/) as string[])[0],
			primaryKey	: primaryKey || "id",
		})
	}
}

export default BelongsTo