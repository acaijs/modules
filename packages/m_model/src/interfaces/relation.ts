// Packages
import { AbstractQuery } 	from "@acai/query"

// Modules
import Model 				from "../modules/Model"

export interface HasManyInterface<model extends Model, cleanModel = Omit<model, keyof Model>> {
	create	(fields?: Partial<cleanModel>)	: Promise		<model>;
	get		()								: Promise		<model[]>;
	find	(id: string | number)			: Promise		<model | undefined>;
	query	()								: AbstractQuery	<model>;
}

export interface HasOneInterface<model extends Model, cleanModel = Omit<model, keyof Model>> {
	findOrCreate	(fields?: Partial<cleanModel>)	: Promise		<model>;
	get				()								: Promise		<model | undefined>;
	delete			()								: Promise		<void>;
	query			()								: AbstractQuery	<model>;
}

export interface BelongsToInterface<model extends Model, primaryKey extends keyof model> {
	get () 								: Promise<model | undefined>;
	set (value: string | number | model): void;
	value	()							: model[primaryKey];
}

/**
 * A utility function to allow you to get any relation type through a generic
 *
 * primaryKey refers to the related model's primary key, not this model's one
 */
type Relation <modelType extends Model, relationtype extends "belongsTo" | "hasOne" | "hasMany", primaryKey extends keyof modelType> = Readonly<
relationtype extends "belongsTo" 	? BelongsToInterface<modelType, primaryKey> :
	relationtype extends "hasOne" 		? HasOneInterface	<modelType> :
		relationtype extends "hasMany" 		? HasManyInterface	<modelType> :
			never>;

export default Relation