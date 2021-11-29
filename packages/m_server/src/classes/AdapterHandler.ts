// Interfaces
import { CustomExceptionInterface, SerializedAdapterInterface } from "@acai/interfaces"

// Utils
import findController from "../utils/findController"
import safeHandle from "../utils/safeHandle"

// Exceptions
import MiddlewareNotFound from "../exceptions/middlewareNotFound"

// Classes
import MiddlewareHandler from "./MiddlewareHandler"


export default class AdapterHandler {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	public readonly adapter: SerializedAdapterInterface

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (adapter: SerializedAdapterInterface) {
		this.adapter = adapter
	}

	public async boot () {
		// Setup providers
		for (let i = 0; i < this.adapter.providers.length; i++) {
			const provider = this.adapter.providers[i]

			await safeHandle(() => provider.boot && provider.boot(this.adapter), this)
		}

		// Boot adapter
		await safeHandle(() => this.adapter.adapter.boot(this.adapter.config), this)

		// Setup request callback
		await safeHandle(
			() => this.adapter.adapter.onRequest(
				this.onRequest.bind(this),
				async (cb) => await safeHandle(
					() => cb(),
					this,
				),
			),
			this,
		)
	}

	public async shutdown () {
		// Shutdown providers
		for (let i = 0; i < this.adapter.providers.length; i++) {
			const provider = this.adapter.providers[i]

			if (provider.shutdown) await provider.shutdown(this.adapter)
		}

		// Turn off adapter
		this.adapter.adapter.shutdown()
	}

	public async onException (error: CustomExceptionInterface, request?: any) {
		// Check provider handle
		for (let i = 0; i < this.adapter.providers.length; i++) {
			const provider = this.adapter.providers[i]
			const response = provider.onError && await provider.onError({error, server: this.adapter, request})

			if (response) return [response, request]
		}

		return undefined
	}

	public async onRequest (request: any, precontroller: string | ((...args: any[]) => any), middlewareNames: string[] = []) {
		const controller = await safeHandle(async () => {
			// Get controller method
			return typeof precontroller === "string" ? await findController( `${this.adapter.config.filePrefix || ""}/${precontroller}`, request.route) : precontroller
		}, this, request)

		const globalsresponse = await safeHandle(async () => {
			// gather compose middlewares
			const globals = this.adapter.globals.map(item => [item, undefined])

			// Pass through middlewares
			const composition = new MiddlewareHandler(globals as any)
			return composition.pipe(request)
		}, this, request, request)

		if (globalsresponse.length === 3 || !Array.isArray(globalsresponse)) return [globalsresponse]

		const middlewaresresponse = await safeHandle(async () => {
			// check if all middlewares are available
			middlewareNames.map(name => name.split(":")[0]).forEach(name => { if (!this.adapter.middlewares[name]) throw new MiddlewareNotFound(name, `${precontroller}`) })

			// gather compose middlewares
			const middlewares = middlewareNames.map(name => name.split(":")).map(([name, ...data]) => [this.adapter.middlewares[name], (data || "").join(":").split(",")])

			// Pass through middlewares
			const composition = new MiddlewareHandler(middlewares as any)
			return composition.pipe(globalsresponse[0])
		}, this, request, globalsresponse)

		if (middlewaresresponse.length === 3 || !Array.isArray(middlewaresresponse)) return [middlewaresresponse]

		return [await controller(middlewaresresponse[0]), middlewaresresponse[0]]
	}
}