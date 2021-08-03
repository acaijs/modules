// Interfaces
import GenericObject from "../interfaces/generic"

export default abstract class BasePresenter {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected static data: GenericObject | GenericObject[];

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public static async present (model: GenericObject, extraData?: GenericObject, formatType?: string) {
		const obj = new (this as any)()
		return await obj.preparePresent(model, extraData, formatType)
	}

	// -------------------------------------------------
	// Abstractions
	// -------------------------------------------------

	public async prepare (_: GenericObject) {}

	public async format (model: GenericObject) {
		return model.toObject()
	}

	public async formatPagination (paginationObject: GenericObject) {
		const perPage 		= parseInt(paginationObject.perPage)
		const total 		= parseInt(paginationObject.totalItems)
		const page 			= parseInt(paginationObject.page)

		return {
			data: 		paginationObject.data,
			perPage,
			total,
			page,
			totalPages: Math.ceil(total / perPage),
		}
	}

	// -------------------------------------------------
	// Helper methods
	// -------------------------------------------------

	protected async prepareFormatList (data: GenericObject, type: string) {
		return Promise.all(data.map(async item => {
			await this.prepare(item)
			return this[type](item)
		}))
	}

	protected async preparePaginatedData (data: GenericObject) {
		if (data.data && Array.isArray(data.data))
			return data.data
		if (data.rows && Array.isArray(data.rows))
			return data.rows
	}

	protected async preparePresent (model: GenericObject, extraData?: GenericObject, formatType?: string) {
		const response:any = {}

		// Is pagination
		const list = await this.preparePaginatedData(model)
		if (list) {
			let data

			// Use custom formatter
			if (formatType) {
				data = await this.prepareFormatList(list, formatType)
			}

			// Use default list format if found or just format
			data = await this.prepareFormatList(list, (this as any).formatList? "formatList" : "format")

			// Insert the rest of the pagination data
			const insert = {...(extraData || {}),...(await this.formatPagination({...model,data}))}

			for (const key in insert) {
				response[key] = insert[key]
			}
		}
		// Object
		else {
			await this.prepare(model)
			response.data = await this[formatType? formatType:"format"](model)

			// Insert extra data
			if (extraData) {
				for (const key in extraData) {
					response[key] = extraData[key]
				}
			}
		}

		return response
	}
}
