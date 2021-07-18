import Model from "../modules/Model";

export default interface FieldInfoInterface {
	name: string;
	type: string;
	args: Record<string, string | number | boolean | string[]>;
	foreign?: {
		model	: Model,
		column	: string,
		type	: "hasOne" | "hasMany" | "belongsTo",
	};
}