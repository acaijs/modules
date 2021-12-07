import { Model } from "../"

// Interfaces
import RelationDataInterface from "../interfaces/relationData"

export default function foreignHandler(this: Model, foreign: RelationDataInterface) {
	// -------------------------------------------------
	// belongsTo
	// -------------------------------------------------

	if (foreign.type === "belongsTo") {
		return {
			get: async () => {
				const key = this.$values[foreign.foreignKey || "id"] as string

				if (key) {
					return foreign.model().find(key as string)
				}

				return undefined
			},
			set: (value: string | number | Model) => {
				if (value && (value as Model).$values)
					this.$values[foreign.foreignKey] = (value as Model).$values[foreign.primaryKey || "id"]
				else
					this.$values[foreign.foreignKey] = value
			},
			value: () => {
				return this.$values[foreign.foreignKey]
			},
		}
	}

	// -------------------------------------------------
	// hasMany
	// -------------------------------------------------

	if (foreign.type === "hasMany") {
		return {
			create: async (fields?: Record<string, unknown>) => {
				const model 							= foreign.model()
				const instance 							= new model()
				instance.$values[foreign.foreignKey] 	= this.$values[foreign.primaryKey || "id"] as string
				if (fields) instance.fill(fields)
				await instance.save()

				return instance
			},
			get: () => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).get()
			},
			find:(id: string | number) => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).where(foreign.model().$primary || "id", id).first()
			},
			query:() => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string)
			},
		}
	}

	// -------------------------------------------------
	// hasOne
	// -------------------------------------------------

	if (foreign.type === "hasOne") {
		return {
			findOrCreate: async (fields?: Record<string, unknown>) => {
				const saved = await foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).first()

				if (saved) return saved

				const model 							= foreign.model()
				const instance 							= new model()
				instance.$values[foreign.foreignKey] 	= this.$values[foreign.primaryKey || "id"] as string
				if (fields) instance.fill(fields)
				await instance.save()

				return instance
			},
			get: () => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).first()
			},
			delete: async () => {
				await foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string).delete()
			},
			query:() => {
				return foreign.model().query().where(foreign.foreignKey, this.$values[foreign.primaryKey || "id"] as string)
			},
		}
	}

	return undefined
}