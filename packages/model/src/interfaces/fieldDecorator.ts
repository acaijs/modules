import { Model } from "../..";

export default interface fielDecorator {
	(type?, args?: Record<string, string | number | boolean | string[]>): PropertyDecorator;

	belongsTo	: (model:() => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
	hasMany		: (model:() => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
	hasOne		: (model:() => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
}