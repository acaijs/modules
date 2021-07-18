import { AbstractQuery } from "@acai/query";
import Model from "../modules/Model";
export interface HasManyInterface<model extends Model, cleanModel = Omit<model, keyof Model>> {
    create(fields?: Partial<cleanModel>): Promise<model>;
    get(): Promise<model[]>;
    find(id: string | number): Promise<model | undefined>;
    query(): AbstractQuery<model>;
}
export interface HasOneInterface<model extends Model, cleanModel = Omit<model, keyof Model>> {
    findOrCreate(fields?: Partial<cleanModel>): Promise<model>;
    get(): Promise<model | undefined>;
    delete(): Promise<void>;
    query(): AbstractQuery<model>;
}
export interface BelongsToInterface<model extends Model> {
    get(): Promise<model | undefined>;
    set(value: string | number | model): void;
    value(): string | number | undefined;
}
declare type Relation<modelType extends Model, relationtype extends "belongsTo" | "hasOne" | "hasMany"> = Readonly<relationtype extends "belongsTo" ? BelongsToInterface<modelType> : relationtype extends "hasOne" ? HasOneInterface<modelType> : relationtype extends "hasMany" ? HasManyInterface<modelType> : never>;
export default Relation;
