import { AbstractQuery } from "@acai/query";
import FieldInfoInterface from "../interfaces/fieldInfo";
import RelationDataInterface from "../interfaces/relationData";
export default class Model {
    static $table: string;
    static $primary: string;
    static $fields: FieldInfoInterface[];
    static $relations: RelationDataInterface[];
    $values: Record<string, unknown>;
    $databaseInitialized: boolean;
    constructor(fields?: Record<string, unknown>, databaseSaved?: boolean);
    toObject<T extends typeof Model, I = InstanceType<T>>(): I;
    toJson(): string;
    static query<T extends typeof Model, I = InstanceType<T>>(this: T): AbstractQuery<I>;
    query<T extends typeof Model>(this: InstanceType<T>): AbstractQuery<InstanceType<T>>;
    static paginate<T extends typeof Model, I = InstanceType<T>>(this: T, page?: number, perPage?: number): Promise<import("@acai/query/src/interfaces/PaginatedResponse").default<I>>;
    static find<T extends typeof Model, I = InstanceType<T>>(this: T, id: string | number): Promise<I | void>;
    static findOrFail<T extends typeof Model, I = InstanceType<T>>(this: T, id: string | number): Promise<I>;
    static first<T extends typeof Model>(this: T): Promise<InstanceType<T> | void>;
    static last<T extends typeof Model, I = InstanceType<T>>(this: T): Promise<I | void>;
    static insert<T extends typeof Model, I = InstanceType<T>>(this: T, fields: Partial<InstanceType<T>>): Promise<I>;
    static insertMany<T extends typeof Model, I = InstanceType<T>>(this: T, rows: Partial<InstanceType<T>>[]): Promise<I[]>;
    static addMigration(): void;
    save(): Promise<void>;
    delete(): Promise<void>;
    fill<T extends typeof Model, I = InstanceType<T>>(this: I, fields: Partial<Omit<I, keyof Model>> & {
        [k in string]: any;
    }): void;
}
