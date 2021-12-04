type signature<response> = (data: {
    value: unknown;
    key: string;
    fields: Record<string, unknown>;
    args?: string[];
    rules: string[];
}) => response;
interface RuleInterface {
    /** Validation to check if value should pass */
    onValidate?: signature<boolean>;
    /** Message to be returned in case of validation error */
    onError?: signature<string | string[]>;
    /** Formats the validated field, runs after validation rule */
    onMask?: signature<unknown>;
}
type Writable<T extends Record<string, any>> = {
    -readonly [K in keyof T]: T[K];
};
interface StringToTypeMap {
    string: string;
    boolean: boolean;
    number: number;
    float: number;
    integer: number;
    object: Record<string, any>;
    "object:string": Record<string, string>;
    "object:number": Record<string, number>;
    "object:boolean": Record<string, boolean>;
    "object:array": Record<string, any[]>;
    "object:object": Record<string, Record<string, any>>;
    array: any[];
    "array:string": string[];
    "array:boolean": boolean[];
    "array:number": number[];
    "array:object": Record<string, any>[];
}
type StringToType<T extends string> = StringToTypeMap[Extract<T, keyof StringToTypeMap>];
type ArrayToType<t extends readonly string[], s extends number[] = [
]> = 
// check if we looped entire array
t["length"] extends s["length"] ? 
// if so return it's last element
StringToType<t[s[0]]> : 
// instead look if current index returns a valid type
StringToType<t[s[0]]> extends never ? 
// we limit the count because arrays could be "infinite" for typescript, so we want to prevent its failsafe lock
s[0] extends 20 ? StringToType<t[s[0]]> : 
// current index didn't return a valid type
ArrayToType<t, [
    s["length"],
    ...s
]> : 
// current index returned a valid type
StringToType<t[s[0]]>;
type TypedArraySanitize<arrayToSanitize extends readonly string[]> = ArrayToType<arrayToSanitize> extends never ? any : ArrayToType<arrayToSanitize>;
type SchemaToTypedSchema<Schema extends Record<string, readonly string[]>> = {
    -readonly [key in keyof Schema]: TypedArraySanitize<Schema[key]>;
};
declare class Validator<Fields extends Record<string, unknown> | undefined = undefined, Keys extends string = keyof ReturnType<InstanceType<typeof Validator>["getSchema"]>, Schema extends Readonly<Record<Keys, readonly string[]>> = ReturnType<InstanceType<typeof Validator>["getSchema"]>, UsageFields extends Record<string, unknown> = Fields extends undefined ? SchemaToTypedSchema<Schema> : Fields> {
    // -------------------------------------------------
    // Properties
    // -------------------------------------------------
    // overwritable
    throwable: boolean;
    // internal
    protected _fields: any;
    protected _validated: Record<string, unknown>;
    protected _errors: Record<string, string[]>;
    // -------------------------------------------------
    // Main methods
    // -------------------------------------------------
    constructor(fields?: Record<string, any>);
    static validate<T extends new (...args: any) => any, I = InstanceType<T>>(this: T, fields?: Partial<ConstructorParameters<T>[0]>, overwriteSchemaOrThrow?: Record<string, string[]> | boolean): I;
    validate(overwriteSchemaOrThrow?: Record<string, string[]> | boolean | undefined): void;
    // -------------------------------------------------
    // Overwritable methods
    // -------------------------------------------------
    getSchema(): Readonly<Record<Keys, readonly string[]>>;
    printErrors(): {
        errors: Record<string, string[]>;
    } | undefined;
    // -------------------------------------------------
    // Get methods
    // -------------------------------------------------
    get rules(): Record<string, RuleInterface>;
    get validated(): Writable<Fields extends undefined ? SchemaToTypedSchema<ReturnType<this["getSchema"]>> : Fields>;
    get errors(): {
        errors: Record<keyof UsageFields, string[]>;
    } | undefined;
    get fields(): Fields extends undefined ? Record<keyof ReturnType<this["getSchema"]> & string, any> : Fields;
}
// methods
declare function setRule(name: string, rule: RuleInterface): void;
declare function setRules(rules: Record<string, RuleInterface>): void;
declare function clearRules(): void;
declare const _default: () => Record<string, RuleInterface>;
export { Validator as default, _default as rules, setRule, setRules, clearRules };
