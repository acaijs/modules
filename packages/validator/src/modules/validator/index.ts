// Interfaces
import RuleInterface 		from "../../interfaces/rule";
import Writable				from "../../interfaces/writable";
import SchemaToTypedSchema 	from "../../interfaces/schemaToTypedSchema";

// Exceptions
import InvalidRuleException from "../../classes/InvalidRuleException";

// Rules
import ruleList from "../../rules/index";

export default class Validator<
	Fields extends Record<string, any> = undefined,
	Keys extends string = keyof ReturnType<InstanceType<typeof Validator>["getSchema"]>,
	UsageFields extends Record<string, any> = Fields extends undefined ? SchemaToTypedSchema<ReturnType<InstanceType<typeof Validator>["getSchema"]>>:Fields
> {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// overwritable
	public throwable = true;

	// internal
	protected _fields	: any;
	protected _validated: Record<string, unknown> 	= {};
	protected _errors	: Record<string, string[]> 	= {};

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	constructor (fields: Record<string, any> = {}) {
		this._fields = fields as any;
	}

	public static validate<T extends new (...args: any) => any, I = InstanceType<T>>(this: T, fields?: Partial<ConstructorParameters<T>[0]>, overwriteSchemaOrThrow?: Record<string, string[]> | boolean): I {
		const validator =  new this(fields);
		validator.validate(overwriteSchemaOrThrow);
		return validator as unknown as I;
	}

	public validate(overwriteSchemaOrThrow: Record<string, string[]> | boolean = undefined) {
		const schema = typeof overwriteSchemaOrThrow === "object" ? overwriteSchemaOrThrow : this.getSchema();

		Object.keys(schema).forEach(fieldName => {
			let passes			= true;
			let fieldValue 		= this._fields[fieldName];
			const rulesApplied 	= Array.isArray(schema[fieldName]) ? (schema[fieldName] as string[]):(schema[fieldName] as string).split(";");
			const isRequired	= rulesApplied.find(i => i.split(":")[0] === "required");
			const rulesNames	= rulesApplied.map(i => i.split(":")[0]);

			if (!(fieldValue === undefined && !isRequired)) {
				for (let i = 0; i < rulesApplied.length; i++) {
					const [name, ...preargs] 	= rulesApplied[i].split(":");
					const args					= (preargs.join(":") || "").split(",");
					const rule 					= this.rules[name];

					if (!rule) {
						throw new InvalidRuleException(`Rule ${name} on validator ${this.constructor.name} doesn't exist`);
					}
	
					// validation failed
					if (rule.onValidate && !rule.onValidate({value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames})) {
						passes = false;
						const error = rule.onError && rule.onError({value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames}) || `${name} failed validation`;
	
						// instance it
						if (!this._errors[fieldName]) this._errors[fieldName] = [];
	
						// push
						if (Array.isArray(error))
							error.forEach(i => this._errors[fieldName].push(i));
						else
							this._errors[fieldName].push(error);
					}
					// validation successful
					else {
						fieldValue = rule.onMask ? rule.onMask({value: fieldValue, key: fieldName, fields: this._fields, args, rules: rulesNames}):fieldValue;
					}
				}

				// validation successful
				if (!this._errors[fieldName]) {
					this._validated[fieldName] = fieldValue;
				}
			}

			if (passes && !this._validated[fieldName]) this._validated[fieldName] = fieldValue;
		});

		// check if should throw
		if (overwriteSchemaOrThrow !== false && this.throwable && Object.keys(this._errors).length > 0) {
			const error 		= new Error("Validation error") as Error & {type: string, data?: Record<string, unknown>, shouldReport?: boolean};
			error.type 			= "validation";
			error.data			= this.printErrors();
			error.shouldReport 	= false;

			throw error;
		}
	}

	// -------------------------------------------------
	// Overwritable methods
	// -------------------------------------------------

	public getSchema(): Readonly<Record<Keys, readonly string[]>> {
		throw new Error(`Schema not implemented`);
	}

	public printErrors () {
		if (Object.keys(this._errors).length === 0) return undefined;

		return {
			errors: this._errors,
		}
	}

	// -------------------------------------------------
	// Get methods
	// -------------------------------------------------

	public get rules (): Record<string, RuleInterface> {
		return ruleList();
	}

	public get validated (): Writable<Fields extends undefined ? SchemaToTypedSchema<ReturnType<this["getSchema"]>>:Fields> {
		return this._validated as any;
	}

	public get errors () {
		return this.printErrors() as any as {errors: Record<keyof UsageFields, string[]>} | undefined;
	}

	public get fields () {
		return this._fields as Fields extends undefined ? Record<(keyof ReturnType<this["getSchema"]>) & string, any>:Fields;
	}
}