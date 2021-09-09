// Packages
import query, { AbstractQuery } from "@acai/query"
import { CustomException } 		from "@acai/utils"

// Interfaces
import FieldInfoInterface 		from "../interfaces/fieldInfo"
import RelationDataInterface 	from "../interfaces/relationData"

// Types
import * as dynamicTypes from "../types/index"

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
					const m = new this()
					m.fill({...r})
					m
				})
			}

			const m = new this()
			m.fill({...result as Record<string, unknown>})
			return m
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

	public static async find <T extends typeof Model, I = InstanceType<T>> (this: T, id: string | number): Promise<I | void> {
		return (await this.query().orderBy(this.$primary).where(this.$primary, id).limit(1).get())[0] as unknown as I | void
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

	public static async first <T extends typeof Model> (this: T): Promise<InstanceType<T> | void> {
		return this.query().first()
	}

	public static async last <T extends typeof Model, I = InstanceType<T>> (this: T): Promise<I | void> {
		return this.query().last<I>()
	}

	public static async insert <T extends typeof Model, I = InstanceType<T>> (this: T, fields: Partial<InstanceType<T>>): Promise<I> {
		const instance = new this()
		instance.fill(fields)
		await instance.save()
		return instance as any as I
	}

	public static async insertMany <T extends typeof Model, I = InstanceType<T>> (this: T, rows: Partial<InstanceType<T>>[]): Promise<I[]> {
		return Promise.all(rows.map(row => this.insert(row))) as any as Promise<I[]>
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
		if (updatedFields) this.fill(updatedFields.toObject())
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
