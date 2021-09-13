// Interfaces
import { CustomExceptionInterface, MiddlewareInterface, SerializedAdapterInterface } from "@acai/interfaces"

// Utils
import findController from "../utils/findController"
import composeMiddlewares from "../utils/composeMiddlewares"
import safeHandle from "../utils/safeHandle"

// Exceptions
import MiddlewareNotFound from "../exceptions/middlewareNotFound"
import Composable from "../utils/composable"


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

			if (response) return response
		}
	}

	public async onRequest (request: any, precontroller: string | ((...args: any[]) => any), middlewareNames: string[] = []) {
		return await safeHandle(async () => {
			// check if all middlewares are available
			middlewareNames.map(name => name.split(":")[0]).forEach(name => { if (!this.adapter.middlewares[name]) throw new MiddlewareNotFound(name, `${precontroller}`) })

			// gather compose middlewares
			const globals = this.adapter.globals.map(item => [item, undefined])
			const middlewares = middlewareNames.map(name => name.split(":")).map(([name, ...data]) => [this.adapter.middlewares[name], (data || "").join(":").split(",")])

			// Get controller method
			const controller = typeof precontroller === "string" ? await findController( `${this.adapter.config.filePrefix || ""}/${precontroller}`, request.route) : precontroller

			// Pass through middlewares
			const composition = composeMiddlewares([...globals, ...middlewares] as ([MiddlewareInterface, string[] | undefined])[], controller)
			const response = composition()(request)

			return response
		}, this)
	}
}