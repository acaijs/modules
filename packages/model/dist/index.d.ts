// Packages
import { AbstractQuery } from "@acai/query";
interface FieldInfoInterface {
    name: string;
    type: string;
    args: Record<string, string | number | boolean | string[]>;
    foreign?: {
        model: Model;
        column: string;
        type: "hasOne" | "hasMany" | "belongsTo";
    };
}
interface RelationDataInterface {
    model: () => typeof Model;
    foreignKey: string;
    primaryKey: string;
    name: string;
    type: "hasOne" | "hasMany" | "belongsTo";
}
declare class Model {
    // -------------------------------------------------
    // Properties
    // -------------------------------------------------
    // static
    static $table: string;
    static $primary: string;
    static $fields: FieldInfoInterface[];
    static $relations: RelationDataInterface[];
    // instance
    $values: Record<string, unknown>;
    $databaseInitialized: boolean;
    // -------------------------------------------------
    // Main Methods
    // -------------------------------------------------
    constructor(fields?: any | undefined, databaseSaved?: boolean);
    toObject<T extends typeof Model, I = InstanceType<T>>(): I;
    toJson(): string;
    // -------------------------------------------------
    // Query methods
    // -------------------------------------------------
    static query<T extends typeof Model, I = InstanceType<T>>(this: T): AbstractQuery<I>;
    query<T extends typeof Model>(this: InstanceType<T>): AbstractQuery<InstanceType<T>>;
    static paginate<T extends typeof Model, I = InstanceType<T>>(this: T, page?: number, perPage?: number): Promise<import("@acai/query").PaginatedResponse<I>>;
    static find<T extends typeof Model, I = InstanceType<T>>(this: T, id: string | number): Promise<I | undefined>;
    static findOrFail<T extends typeof Model, I = InstanceType<T>>(this: T, id: string | number): Promise<I>;
    static first<T extends typeof Model>(this: T): Promise<InstanceType<T> | undefined>;
    static last<T extends typeof Model, I = InstanceType<T>>(this: T): Promise<I | undefined>;
    static insert<T extends typeof Model, I extends InstanceType<T> = InstanceType<T>>(this: T, fields: Partial<InstanceType<T>>): Promise<I>;
    static insertMany<T extends typeof Model, I = InstanceType<T>>(this: T, rows: Partial<InstanceType<T>>[]): Promise<I[]>;
    static updateMany<T extends typeof Model>(this: T, models: Record<string, InstanceType<T>> | [
        string,
        InstanceType<T>
    ]): Promise<void>;
    // -------------------------------------------------
    // Migration methods
    // -------------------------------------------------
    static addMigration(): void;
    // -------------------------------------------------
    // Instance methods
    // -------------------------------------------------
    save(): Promise<void>;
    delete(): Promise<void>;
    fill<T extends typeof Model, I = InstanceType<T>>(this: I, fields: Partial<Omit<I, keyof Model>> & {
        [k in string]: any;
    }): void;
}
declare const ModelDecorator: (table: string, primary?: string) => ClassDecorator;
declare const getModels: () => (typeof Model)[];
declare const _default: {
    clear: () => {};
    add: (name: string, modelType: Partial<Record<default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number | undefined;
        };
    }>) => Partial<Record<default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number | undefined;
        };
    }>;
    get: (name: string) => Partial<Record<default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number | undefined;
        };
    }>;
    all: () => Record<string, Partial<Record<default, (data: {
        value: unknown;
        row: Record<string, unknown>;
        args?: any;
        model: typeof Model;
        key: string;
    }) => unknown> & {
        type: {
            type: string;
            length?: number | undefined;
        };
    }>>;
};
declare class Hasher {
    // -------------------------------------------------
    // Properties
    // -------------------------------------------------
    protected value: string;
    protected saltOrRounds: string | number | undefined;
    // -------------------------------------------------
    // Main methods
    // -------------------------------------------------
    constructor(value?: string, saltOrRounds?: string);
    // -------------------------------------------------
    // Instance methods
    // -------------------------------------------------
    hash(value: string): void;
    toString(): string;
    compare(valueToCompare: string): boolean;
    // -------------------------------------------------
    // Helper methods
    // -------------------------------------------------
    private hashCode;
}
interface HasManyInterface<model extends Model, cleanModel = Omit<model, keyof Model>> {
    create(fields?: Partial<cleanModel>): Promise<model>;
    get(): Promise<model[]>;
    find(id: string | number): Promise<model | undefined>;
    query(): AbstractQuery<model>;
}
interface HasOneInterface<model extends Model, cleanModel = Omit<model, keyof Model>> {
    findOrCreate(fields?: Partial<cleanModel>): Promise<model>;
    get(): Promise<model | undefined>;
    delete(): Promise<void>;
    query(): AbstractQuery<model>;
}
interface BelongsToInterface<model extends Model, primaryKey extends keyof model> {
    get(): Promise<model | undefined>;
    set(value: string | number | model): void;
    value(): model[primaryKey];
}
/**
 * A utility function to allow you to get any relation type through a generic
 *
 * primaryKey refers to the related model's primary key, not this model's one
 */
type Relation<modelType extends Model, relationtype extends "belongsTo" | "hasOne" | "hasMany", primaryKey extends keyof modelType> = Readonly<relationtype extends "belongsTo" ? BelongsToInterface<modelType, primaryKey> : relationtype extends "hasOne" ? HasOneInterface<modelType> : relationtype extends "hasMany" ? HasManyInterface<modelType> : never>;
interface fieldDecorator {
    (type?: any, args?: Record<string, string | number | boolean | string[]> | string[]): PropertyDecorator;
    belongsTo: (model: () => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
    hasMany: (model: () => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
    hasOne: (model: () => typeof Model, foreignKey: string, primaryKey?: string) => PropertyDecorator;
}
type FieldDecoratorInterface = fieldDecorator;
declare const Field: FieldDecoratorInterface;
/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/
export { Model, ModelDecorator as Table, _default as typeManager, getModels, Hasher, Relation, Field };
