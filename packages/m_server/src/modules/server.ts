// Interfaces
import { AdapterInterface, ClassType, SerializedAdapterInterface } from "@acai/interfaces"
import { ProviderInterface, MiddlewareInterface } from "@acai/interfaces"
import { ServerConfigInterface, ServerInterface } from "@acai/interfaces"

// Utils
import deepMerge from "../utils/deepMerge"

// Exceptions
import AdapterNotFound from "../exceptions/adapterNotFound"

// Adapters
import HttpAdapter from "../adapters/http"

// Classes
import AdapterHandler from "../classes/AdapterHandler"
import instanciable from "../utils/instanciable"

export default class Server implements ServerInterface {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected _config: Partial<ServerConfigInterface>;
	protected adapters: Record<string, SerializedAdapterInterface & {handler?: AdapterHandler}> = {};

	// -------------------------------------------------
	// Boot methods
	// -------------------------------------------------

	public constructor (config?: Partial<ServerConfigInterface>) {
		this._config = config || {}
		this.addAdapter("http", HttpAdapter)
	}

	public setConfig (config: Partial<ServerConfigInterface>): void;
	public setConfig (adapter: string | string[], config: Partial<ServerConfigInterface>): void;

	public setConfig (adapterOrConfig: string | string[] | Partial<ServerConfigInterface>, configOrNone?: Partial<ServerConfigInterface>) {
		// normalize instances
		const adapters = configOrNone && (typeof adapterOrConfig === "string" ? [adapterOrConfig] : adapterOrConfig)
		const config = configOrNone || adapterOrConfig as Partial<ServerConfigInterface>

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			// Config is per adapter
			adapters.forEach(adapter => this.adapters[adapter].config = deepMerge(this.adapters[adapter].config, config))
			return
		}

		// set for reference when adding others adapters later
		this._config = deepMerge(this._config, config)

		// push to all adapters
		Object.keys(this.adapters).forEach(adapter => this.adapters[adapter].config = deepMerge(this.adapters[adapter].config, config))
	}

	public getConfig () : Partial<ServerConfigInterface>;
	public getConfig (adapter: string) : Partial<ServerConfigInterface> | undefined;

	public getConfig (adapter?: string) {
		if (adapter) return this.adapters[adapter]?.config

		return this._config
	}

	public deleteConfig (key: string) : void;
	public deleteConfig (adapter: string | string[], key: string) : void;

	public deleteConfig (adapterOrKey: string | string[], keyOrNone?: string): void {
		const adapters = keyOrNone && (typeof adapterOrKey === "string" ? [adapterOrKey] : adapterOrKey)
		const key = keyOrNone || adapterOrKey as string

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			// Config is per adapter
			adapters.forEach(adapter => void delete this.adapters[adapter].config[key])
			return
		}
	}

	// -------------------------------------------------
	// Provider methods
	// -------------------------------------------------

	public addProvider(provider: ProviderInterface): void;
	public addProvider(adapter: string | string[], provider: ProviderInterface): void;

	public addProvider(adapterOrProvider: string | string[] | ProviderInterface, providerOrNone?: ProviderInterface): void {
		// normalize instances
		const adapters = providerOrNone && (typeof adapterOrProvider === "string" ? [adapterOrProvider] : adapterOrProvider as string[])
		const provider = providerOrNone || adapterOrProvider as ProviderInterface

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			adapters.forEach(adapter => this.adapters[adapter].providers.push(instanciable(provider)))
			return
		}

		// push to all adapters
		Object.values(this.adapters).forEach(adapter => adapter.providers.push(instanciable(provider)))
	}

	public addProviders (providers: ProviderInterface[]) : void;
	public addProviders (adapter: string | string[], Providers: ProviderInterface[]): void;

	public addProviders(adapterOrProviders: string | string[] | ProviderInterface[], providersOrNone?: ProviderInterface[]): void {
		// normalize instances
		const adapters = providersOrNone && (typeof adapterOrProviders === "string" ? [adapterOrProviders] : adapterOrProviders as string[])
		const providers = providersOrNone ? providersOrNone : adapterOrProviders as ProviderInterface[]

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			providers.forEach(provider => this.addProvider(adapters, provider))
			return
		}

		// push to all adapters
		providers.forEach(provider => this.addProvider(provider))
	}

	public clearProviders () : void;
	public clearProviders (adapter: string | string[]) : void;

	public clearProviders(_adapters?: string | string[]): void {
		// normalize instances
		const adapters = typeof _adapters === "string" ? [_adapters]: _adapters

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			adapters.forEach(adapter => this.adapters[adapter].providers = [])
			return
		}

		// push to all adapters
		Object.values(this.adapters).forEach(adapter => adapter.providers = [])
	}

	// -------------------------------------------------
	// Middleware methods
	// -------------------------------------------------

	public addMiddleware (id: string, middleware: MiddlewareInterface) : void;
	public addMiddleware (adapter: string | string[], id: string, middleware: MiddlewareInterface) : void;

	public addMiddleware(idOrAdapter: string | string[], middlewareOrId: string | MiddlewareInterface, cb?: MiddlewareInterface): void {
		// normalize instances
		const adapters = cb && (typeof idOrAdapter === "string" ? [idOrAdapter] : idOrAdapter)
		const id = (cb ? middlewareOrId : idOrAdapter) as string
		const middleware = cb ? cb : middlewareOrId as MiddlewareInterface

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})


			adapters.forEach(adapter => this.adapters[adapter].middlewares[id] = instanciable(middleware))
			return
		}

		// push to all adapters
		Object.values(this.adapters).forEach(adapter => adapter.middlewares[id] = instanciable(middleware) as MiddlewareInterface)
	}

	public addMiddlewares (middlewares: Record<string, MiddlewareInterface>) : void;
	public addMiddlewares (adapter: string | string[], middlewares: Record<string, MiddlewareInterface>) : void;

	public addMiddlewares(middlewaresOrAdapter: Record<string, MiddlewareInterface> | string | string[], middlewares?: Record<string, MiddlewareInterface>): void {
		// normalize instances
		const adapters = middlewares ? (typeof middlewaresOrAdapter === "string" ? [middlewaresOrAdapter] : middlewaresOrAdapter as string[]) : undefined
		const middlewareGroup = middlewares ? middlewares : middlewaresOrAdapter

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			Object.keys(middlewareGroup).forEach(middleware => this.addMiddleware(adapters, middleware, middlewareGroup[middleware]))

			return
		}

		// push to all adapters
		Object.keys(middlewareGroup).forEach(middlewareKey => this.addMiddleware(middlewareKey, middlewaresOrAdapter[middlewareKey]))
	}

	public clearMiddlewares (middlewares?: string | string[]) : void;
	public clearMiddlewares (adapter: string, middlewares?: string | string[]) : void;

	public clearMiddlewares(adapterOrMiddlewares?: string | string[], middlewares?: string | string[]): void {
		// normalize instances
		const adapters = middlewares && (typeof adapterOrMiddlewares === "string" ? [adapterOrMiddlewares] : adapterOrMiddlewares)
		const middlewaresToRemove = (middlewares ? typeof middlewares === "string" ? [middlewares] : middlewares : typeof adapterOrMiddlewares === "string" ? [adapterOrMiddlewares] : adapterOrMiddlewares) as string[]

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			adapters.forEach(id => middlewaresToRemove.forEach(middleware => delete this.adapters[id].middlewares[middleware]))
			return
		}

		if (middlewaresToRemove) {
			Object.values(this.adapters).forEach(adapter => middlewaresToRemove.forEach(middleware => { delete adapter.middlewares[middleware] }))
			return
		}

		// push to all adapters
		Object.values(this.adapters).forEach(adapter => adapter.middlewares = {})
	}

	// -------------------------------------------------
	// Global middleware methods
	// -------------------------------------------------

	public addGlobal (cb: MiddlewareInterface) : void;
	public addGlobal (adapter: string | string[], cb: MiddlewareInterface) : void;

	public addGlobal(adapterOrCallback: MiddlewareInterface | string | string[], cb?: MiddlewareInterface): void {
		// normalize instances
		const adapters = cb && (typeof adapterOrCallback === "string" ? [adapterOrCallback]:adapterOrCallback as string[])
		const callback = cb || adapterOrCallback as MiddlewareInterface

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			adapters.forEach(adapter => this.adapters[adapter].globals.push(instanciable(callback)))
			return
		}

		// push to all adapters
		Object.values(this.adapters).forEach(adapter => adapter.globals.push(instanciable(callback)))
	}

	public addGlobals (middlewares: MiddlewareInterface[]) : void;
	public addGlobals (adapter: string | string[], middlewares: MiddlewareInterface[]) : void;

	public addGlobals(adapterOrGlobals: string | string[] | MiddlewareInterface[], globalsOrNone?: MiddlewareInterface[]): void {
		// normalize instances
		const adapters = globalsOrNone && (typeof adapterOrGlobals === "string" ? [adapterOrGlobals] : adapterOrGlobals as string[])
		const globals = globalsOrNone || adapterOrGlobals as MiddlewareInterface[]

		if (adapters) {
			// make sure all adapters referenced exist
			adapters.forEach(adapter => {if (!this.adapters[adapter]) throw new AdapterNotFound(adapter)})

			globals.forEach(global => this.addGlobal(adapters, global))
			return
		}

		// push to all adapters
		(adapterOrGlobals as MiddlewareInterface[]).forEach(global => this.addGlobal(global))
	}

	public clearGlobals () : void;
	public clearGlobals (adapter: string | string[]) : void;

	public clearGlobals(_adapters?: string | string[]): void {
		// normalize instances
		const adapters = typeof _adapters === "string" ? [_adapters] : _adapters

		if (adapters) {
			adapters.forEach(adapter => this.adapters[adapter].globals = [])
			return
		}

		// push to all adapters
		Object.values(this.adapters).forEach(adapter => adapter.globals = [])
	}

	// -------------------------------------------------
	// Adapter methods
	// -------------------------------------------------

	public addAdapter (name: string, adapter: ClassType<AdapterInterface> | AdapterInterface, config?: Partial<ServerConfigInterface>) {
		this.adapters[name] = {
			name,
			adapter: instanciable(adapter),
			middlewares: {},
			providers: [],
			globals: [],
			config: config ? deepMerge(this._config, config) : this._config,
			running: false,
			handler: undefined,
		}
	}

	public injectAdapter (name: string | string[]) {
		const adapters = typeof name === "string" ? [name] : name

		adapters.forEach
	}

	public getAdapter (name: string): SerializedAdapterInterface | undefined {
		return this.adapters[name]
	}

	public removeAdapter (name: string) {
		delete this.adapters[name]
	}

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public async run(adaptersToRun?: string[] | string): Promise<void> {
		const adapters = (typeof adaptersToRun === "string" ? [adaptersToRun] : adaptersToRun) || Object.keys(this.adapters)

		await Promise.all(adapters.map(name => (async () => {
			// check handler exists
			if (!this.adapters[name]) return console.log(`Adapter ${name} was not found, skipping.`)

			// handler responsible for talking with adapter
			const handler = this.adapters[name].handler = new AdapterHandler(this.adapters[name])
			this.adapters[name].handler = handler
			this.adapters[name].running = true

			await handler.boot()
		})()))
	}

	public async stop(adaptersToStop?: string[] | string) {
		const adapters = (typeof adaptersToStop === "string" ? [adaptersToStop] : adaptersToStop) || Object.keys(this.adapters)

		await Promise.all(adapters.map(name => (async () => {
			if (this.adapters[name]) {
				await this.adapters[name].handler?.shutdown()

				this.adapters[name].handler = undefined
				this.adapters[name].running = false
			}
		})()))
	}

	public async isRunning(adaptersToCheck?: string | string[]) {
		const adapters = (typeof adaptersToCheck === "string" ? [adaptersToCheck] : adaptersToCheck) || Object.keys(this.adapters)

		return adapters.filter(adapter => this.adapters[adapter].running).length
	}
}