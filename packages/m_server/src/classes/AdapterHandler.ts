// Interfaces
import { CustomExceptionInterface, SerializedAdapterInterface } from "@acai/interfaces"

// Utils
import findController from "../utils/findController"
import composeMiddlewares from "../utils/composeMiddlewares"
import safeHandle from "../utils/safeHandle"

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
				async (cb) => await safeHandle(
					() => cb(this.onRequest.bind(this)),
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

	public async onRequest (data: any, path: string | ((...args: any[]) => any), middlewareNames: string[] = []) {
		const globals = this.adapter.globals
		const middlewares = middlewareNames.map(name => this.adapter.middlewares[name])

		// Get controller method
		const request = await safeHandle(() => findController(path, data), this)

		// Pass through middlewares
		const composition = composeMiddlewares([...globals, ...middlewares])(request)
		const response = await safeHandle(() => composition(data), this)

		return response
	}
}