import RuleInterface from "../../interfaces/rule";
import Writable from "../../interfaces/writable";
import SchemaToTypedSchema from "../../interfaces/schemaToTypedSchema";
export default class Validator<Fields extends Record<string, any> = undefined, Keys extends string = keyof ReturnType<InstanceType<typeof Validator>["getSchema"]>, UsageFields extends Record<string, any> = Fields extends undefined ? SchemaToTypedSchema<ReturnType<InstanceType<typeof Validator>["getSchema"]>> : Fields> {
    throwable: boolean;
    protected _fields: any;
    protected _validated: Record<string, unknown>;
    protected _errors: Record<string, string[]>;
    constructor(fields?: Record<string, any>);
    static validate<T extends new (...args: any) => any, I = InstanceType<T>>(this: T, fields?: Partial<ConstructorParameters<T>[0]>, overwriteSchemaOrThrow?: Record<string, string[]> | boolean): I;
    validate(overwriteSchemaOrThrow?: Record<string, string[]> | boolean): void;
    getSchema(): Readonly<Record<Keys, readonly string[]>>;
    printErrors(): {
        errors: Record<string, string[]>;
    };
    get rules(): Record<string, RuleInterface>;
    get validated(): Writable<Fields extends undefined ? SchemaToTypedSchema<ReturnType<this["getSchema"]>> : Fields>;
    get errors(): {
        errors: Record<keyof UsageFields, string[]>;
    };
    get fields(): Fields extends undefined ? Record<keyof ReturnType<this["getSchema"]> & string, any> : Fields;
}
