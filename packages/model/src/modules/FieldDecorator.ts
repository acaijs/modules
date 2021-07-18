// Interfaces
import FieldInfoInterface from "../interfaces/fieldInfo";

const Field = (type = "string", args?: Record<string, string | number | boolean | string[]>): PropertyDecorator => {
	return (target, key) => {
		const model = target.constructor.prototype as { $fields?: FieldInfoInterface[] };

		if (!model.$fields) model.$fields = [];

		const extraargs = {} as Record<string, string | boolean>;
		if (type.match(/^\w+\?/)) extraargs.nullable 	= true;
		if (type.match(/^\w+\*/)) extraargs.primary 	= true;
		if (type.match(/^\w+\!/)) extraargs.unique 		= true;
		if (type.match(/^\w+\=/)) extraargs.default 	= type.split("=")[1];

		model.$fields.push({
			name: key as string,
			type: type.match(/^\w+/)[0],
			args: {...args, ...extraargs},
		});
	}
}

export default Field;