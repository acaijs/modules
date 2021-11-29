// Packages
import query, { AbstractQuery } from "@acai/query"
import { CustomException } 		from "@acai/utils"

// Interfaces
import FieldInfoInterface 		from "../interfaces/fieldInfo"
import RelationDataInterface 	from "../interfaces/relationData"

// Types
import * as dynamicTypes from "../types/index"

// Utils
import foreignHandler from "../utils/foreignHandler"

export default class Model {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// static
	public static $table		: string;
	public static $primary		 = "id";
	public static $fields		: FieldInfoInterface[] = [];
	public static $relations	: RelationDataInterface[] = [];

	// instance
	public $values: Record<string, unknown> = {};
	public $databaseInitialized = false;

	// -------------------------------------------------
	// Main Methods
	// -------------------------------------------------

	public constructor (fields: any | undefined = undefined, databaseSaved = false) {
		const modelClass			= this.constructor.prototype as {$fields: FieldInfoInterface[]; $relations: RelationDataInterface[]}
		const $allFields 			= modelClass.$fields
		this.$databaseInitialized 	= databaseSaved

		// set fields
		if ($allFields) {
			for (let i = 0; i < $allFields.length; i++) {
				const field 	= $allFields[i]
				const foreign	= (modelClass.$relations || []).find((i) => i.name === field.name)
				const handler 	= foreign ? foreignHandler : undefined

				// define custom getter
				Object.defineProperty(this, field.name, {
					enumerable: true,
					configurable: true,
					set: (value) => {
						// not a foreign
						if (!foreign) {
							const dynamictype 			= dynamicTypes.get(field.type)
							const callback 				= databaseSaved ? dynamictype.onRetrieve : dynamictype.onCreate
							this.$values[field.name] 	= callback ? callback({key: field.name, value, row: this.$values as any, args: field.args, model: this.constructor as any}) : value
						}
						else if (foreign.type === "belongsTo") {
							this.$values[foreign.foreignKey] = value
						}
					},
					get: () => {
						// custom getter
						if (handler) {
							return handler.bind(this)(foreign!)
						}
						// not a foreign
						else {
							return this.$values[field.name]
						}
					},
				})
			}
		}

		if (fields) this.fill(fields)
	}


	public toObject <T extends typeof Model, I = InstanceType<T>> () : I {
		const serializedValues = {} as I

		this.constructor.prototype.$fields.forEach(field => {
			const value 	= this.$values[field.name]
			const onSet 	= dynamicTypes.get(field.type).onSerialize
			const foreign	= (this.constructor.prototype.$relations || []).find(i => i.name === field.name)

			if (foreign) {
				if (foreign.type === "belongsTo") {
					serializedValues[foreign.foreignKey] = this.$values[foreign.foreignKey]
				}
			}
			else {
				serializedValues[field.name] = onSet ? onSet({key: field.name, value, row: this.$values as any, args: field.args, model: this.constructor as any}):value
			}
		})

		return serializedValues
	}

	public toJson () {
		return JSON.stringify(this.toObject())
	}

	// -------------------------------------------------
	// Query methods
	// -------------------------------------------------

	public static query <T extends typeof Model, I = InstanceType<T>> (this: T): AbstractQuery<I> {
		return query().table(this.$table).parseResult((result: unknown) => {
			if (Array.isArray(result)) {
				return result.map(r => {
					return new this({...r}, true)
				})
			}

			return new this({...result as Record<string, unknown>}, true)
		}) as unknown as AbstractQuery<I>
	}

	public query <T extends typeof Model> (this: InstanceType<T>): AbstractQuery<InstanceType<T>> {
		return query().table((this as any).constructor.$table).parseResult((result: unknown) => {
			if (Array.isArray(result)) {
				return result.map(r => {
					return new (this as any).prototype.constructor({...r}, true)
				})
			}

			return new (this as any)({...(result as Record<string, unknown>)}, true)
		}) as unknown as AbstractQuery<InstanceType<T>>
	}

	public static async paginate <T extends typeof Model, I = InstanceType<T>> (this: T, page = 1, perPage = 25) {
		return this.query().paginate<I>(page, perPage)
	}

	public static async find <T extends typeof Model, I = InstanceType<T>> (this: T, id: string | number): Promise<I | undefined> {
		return (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0] as unknown as I | undefined
	}

	public static async findOrFail <T extends typeof Model, I = InstanceType<T>> (this: T, id: string | number): Promise<I> {
		const response = (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0] as unknown as I

		if (!response) {
			throw new CustomException("modelNotFound", `Model ${this.name} with ${this.$primary} ${id} not found`, {
				model		: this.name,
				primaryKey	: this.$primary,
				id			: id,
			})
		}

		return response as I
	}

	public static async first <T extends typeof Model> (this: T): Promise<InstanceType<T> | undefined> {
		return this.query().first()
	}

	public static async last <T extends typeof Model, I = InstanceType<T>> (this: T): Promise<I | undefined> {
		return this.query().last<I>()
	}

	public static async insert <T extends typeof Model, I extends InstanceType<T> = InstanceType<T>> (this: T, fields: Partial<InstanceType<T>>): Promise<I> {
		const instance = new this()
		instance.fill(fields)
		await instance.save()
		return instance as I
	}

	public static async insertMany <T extends typeof Model, I = InstanceType<T>> (this: T, rows: Partial<InstanceType<T>>[]): Promise<I[]> {
		return Promise.all(rows.map(i => this.insert(i))) as Promise<I[]>
	}

	public static async updateMany <T extends typeof Model, I = InstanceType<T>> (this: T, models: Record<string, InstanceType<T>> | [string, InstanceType<T>]) {
		const normalized = Array.isArray(models) ? models : Object.entries(models)

		Promise.all(normalized.map(entry => void this.query().where(this.$primary, entry[0]).update(entry[1])))
	}

	// -------------------------------------------------
	// Migration methods
	// -------------------------------------------------

	public static addMigration () {
		const fields = {};

		// map fields
		(this.prototype as unknown as {$fields: FieldInfoInterface[]}).$fields.forEach(field => {
			const typeObj = {...(dynamicTypes.get(field.type).type || {type: "string"}), ...field.args}

			fields[field.name] = {
				...typeObj,
				primary: this.$primary === field.name,
			}

			const { $relations } = (this.prototype as unknown as {$relations?: RelationDataInterface[]})

			// check foreign key
			if ($relations) {
				$relations.forEach(foreign => {
					if (foreign.name === field.name) {
						// unset field because we won't be using it
						delete fields[field.name]

						if (foreign.type === "belongsTo") {
							const primary 		= foreign.primaryKey || foreign.model().$primary
							const primaryType 	= (foreign.model().prototype as any).$fields.find(i => i.name === primary)
							const typeObj 		= {...(dynamicTypes.get(primaryType.type).type || {type: "string"}), ...field.args}

							// add foreign key
							fields[foreign.foreignKey] = {
								...typeObj,
								foreign: {
									table	: foreign.model().$table,
									column	: primary,
									onDelete: "CASCADE",
								},
							}
						}
					}
				})
			}
		})

		query().addMigration(this.$table, fields)
	}

	// -------------------------------------------------
	// Instance methods
	// -------------------------------------------------

	public async save () {
		const { $table, $primary } 	= this.constructor as any
		const { $fields } 			= this.constructor.prototype as any

		// get fields
		const fields = {}
		for (let i = 0; i < $fields.length; i++) {
			const field 	= $fields[i]
			const value 	= this.$values[field.name]
			const onSet 	= dynamicTypes.get(field.type).onSave
			const foreign	= (this.constructor.prototype.$relations || []).find(i => i.name === field.name)

			if (foreign) {
				if (foreign.type === "belongsTo") {
					fields[foreign.foreignKey] = this.$values[foreign.foreignKey]
				}
			}
			else {
				fields[field.name] = onSet ? onSet({key: field.name, value, row: this.$values as any, args: field.args, model: this.constructor as any}):value
			}
		}

		// already on database, just update
		let id
		if (this.$databaseInitialized) {
			await query().table($table).where($primary, fields[$primary] as string).update(fields)
			id = fields[$primary]
		}
		// not on database, create
		else {
			id = await query().table($table).insert(fields) || fields[$primary]
			this.$databaseInitialized = true
		}

		// update fields
		const updatedFields = await query().table($table).where($primary, id).first() as any
		if (updatedFields) this.fill(updatedFields)
	}

	public async delete () {
		const { $table, $primary } 	= this.constructor as any

		// only should delete if already on database
		if (this.$databaseInitialized) {
			await query().table($table).where($primary, this.$values[$primary] as string).delete()
		}

		this.$databaseInitialized = false
	}

	public fill <T extends typeof Model, I = InstanceType<T>> (this: I, fields: Partial<Omit<I, keyof Model>> & {[k in string]: any}) {
		const $allFields 		= ((this as any).constructor.prototype as {$fields?: FieldInfoInterface[]}).$fields || []
		const { $relations } 	= ((this as any).constructor.prototype as {$relations: RelationDataInterface[]})

		// set fields
		for (let i = 0; i < $allFields.length; i++) {
			const field 	= $allFields[i]
			const foreign 	= ($relations || []).find(i => i.name === field.name)

			if (foreign && foreign.type === "belongsTo") {
				if (fields[foreign.foreignKey] || fields[field.name]) {
					this[field.name].set(fields[foreign.foreignKey] || fields[field.name])
				}
			}
			else {
				this[field.name] = (fields || {})[field.name]
			}
		}
	}
}
