import Model from "../modules/Model";

export default interface RelationDataInterface {
	model		: () => typeof Model,
	foreignKey	: string,
	primaryKey	: string,
	name		: string,
	type		: "hasOne" | "hasMany" | "belongsTo",
}