import { SerializedAdapterInterface } from "@acai/interfaces"
import composeMiddlewares from "../utils/composeMiddlewares"

export default class AdapterHandler {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected adapter: SerializedAdapterInterface

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

			if (provider.boot) await provider.boot(this.adapter)
		}

		// Setup request callback
		this.adapter.adapter.onRequest(this.onRequest as any)
	}

	public async onRequest (request: any, middlewareNames: string[]) {
		const middlewares = middlewareNames.map(name => this.adapter.middlewares[name])

		// Pass through middlewares
		return composeMiddlewares(middlewares, request)
	}
}