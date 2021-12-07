// Interfaces
import ServerConfigInterface from "./server.config"
import MiddlewareType from "../types/middleware"
import ProviderInterface from "./provider"
import AdapterInterface from "./adapter"
import SerializedAdapterInterface from "./adapter.serialized"

export default interface ServerInterface {
	// -------------------------------------------------
	// Config methods
	// -------------------------------------------------

	/**
	 * ### Set config
	 *
	 * Set a config to be used by all adapters
	 *
	 * @param {Partial<ServerConfigInterface>} config
	 */
	setConfig (config: Partial<ServerConfigInterface>): void;

	/**
	 * ### Set config
	 *
	 * Set a config to be used by predetermined adapters
	 *
	 * @param {string | string[]} adapter
	 * @param {Partial<ServerConfigInterface>} config
	 */
	setConfig (adapter: string | string[], config: Partial<ServerConfigInterface>): void;

	/**
	 * ### Get config
	 *
	 * Get a config destined to be injected in all adapters
	 *
	 * @param {string} adapter
	 */
	getConfig () : Partial<ServerConfigInterface>;

	/**
	 * ### Get config
	 *
	 * Get a config destined to a specific adapter
	 *
	 * @param {string} adapter
	 */
	getConfig (adapter: string) : Partial<ServerConfigInterface> | undefined;

	/**
	 * ### Delete config
	 *
	 * Delete config present in all adapters
	 *
	 * @param {string} key The name of the config to be deleted
	 */
	deleteConfig (key: string) : void;

	/**
	 * ### Delete config
	 *
	 * Delete config destined for an adapter
	 *
	 * @param {string|string[]} adapter
	 * @param {string} key
	 */
	deleteConfig (adapter: string | string[], key: string) : void;

	// -------------------------------------------------
	// Provider methods
	// -------------------------------------------------

	/**
	 * ### Add provider
	 *
	 * Add a single provider to be run when the server starts
	 *
	 * @param {ProviderInterface} provider provider class (not instance)
	 */
	addProvider (provider: ProviderInterface) : void;
	addProvider (adapter: string | string[], provider: ProviderInterface) : void;

	/**
	 * ### Add providers
	 *
	 * Add multiple providers to be run when the server starts
	 *
	 * @param {ProviderInterface} provider provider class (not instance)
	 */
	addProviders (providers: ProviderInterface[]) : void;
	addProviders (adapter: string | string[], providers: ProviderInterface[]) : void;

	/**
	 * ### Clear providers
	 *
	 * Remove all providers
	 */
	clearProviders () : void;
	clearProviders (adapter: string | string[]) : void;

	// -------------------------------------------------
	// Middleware methods
	// -------------------------------------------------

	/**
	 * ### Add middleware
	 *
	 * Add a single scoped middleware to run for certain routes. They are identified by their id.
	 *
	 * @param {string} id
	 * @param {MiddlewareType} middleware
	 */
	addMiddleware (id: string, middleware: MiddlewareType) : void;
	addMiddleware (adapter: string | string[], id: string, middleware: MiddlewareType) : void;

	/**
	 * ### Add multiple middlewares
	 *
	 * Add a list scoped middleware to run for certain routes. They are identified by their id.
	 *
	 * @param {Record<string, MiddlewareType>} middlewares
	 */
	addMiddlewares (middlewares: Record<string, MiddlewareType>) : void;
	addMiddlewares (adapter: string | string[], middlewares: Record<string, MiddlewareType>) : void;

	/**
	 * ### Clear middlewares
	 *
	 * Clear all middlewares added to the server instance
	 */
	clearMiddlewares (id?: string | string[]) : void;
	clearMiddlewares (adapter: string | string[], id?: string | string[]) : void;

	// -------------------------------------------------
	// Global methods
	// -------------------------------------------------

	/**
	 * ### Add global
	 *
	 * Add a single global middleware to run for all routes.
	 *
	 * @param {string} id
	 * @param {MiddlewareType} middleware
	 */
	addGlobal (cb: MiddlewareType) : void;
	addGlobal (adapter: string | string[], cb: MiddlewareType) : void;

	/**
	 * ### Add globals
	 *
	 * Add a list of global middlewares to run for all routes.
	 *
	 * @param {string} id
	 * @param {MiddlewareType} middleware
	 */
	addGlobals (middlewares: MiddlewareType[]) : void;
	addGlobals (adapter: string | string[], middlewares: MiddlewareType[]) : void;

	/**
	 * ### Clear globals
	 *
	 * Clear all global middlewares added to the server instance
	 */
	clearGlobals () : void;
	clearGlobals (adapter: string | string[]) : void;

	// -------------------------------------------------
	// Adapter methods
	// -------------------------------------------------

	/**
	 * ### Inject adapter
	 *
	 * Inject an adapter from the vanilla Açaí Server Official Adapters. **Adapters are not shared across server instances!**
	 *
	 * @param {string} name Identifier of the adapter to be removed
	 */
	injectAdapter (name: string | string[]): void;

	/**
	 * ### Add adapter
	 *
	 * An adapter is an internal server that will be controlled by this instance, where it will handle all configs
	 * and requests and parse everything for you.
	 *
	 * @param {string} name Name of the adapter to be referenced later on
	 * @param {AdapterInterface} adapter
	 */
	addAdapter (name: string, adapter: AdapterInterface, config?: Partial<ServerConfigInterface>): void;

	/**
	 * ### Get adapter
	 *
	 * Get an adapter from the current server instance **Adapters are not shared across server instances!**
	 *
	 * @param {string} name Identifier of the adapter to be removed
	 */
	getAdapter (name: string): SerializedAdapterInterface | undefined;

	/**
	 * ### Remove adapter
	 *
	 * Remove a pre-existing adapter inside of this server instance. **Adapters are not shared across server instances!**
	 *
	 * @param {string} name Identifier of the adapter to be removed
	 */
	removeAdapter (name: string | string[]): void;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	/**
	 * ### Run
	 *
	 * Actually start the server instance
	 */
	run (): Promise<void>;
	run (adapters: string[]): Promise<void>;

	/**
	 * ### Stop
	 *
	 * Turn off server instance to accept requests
	 */
	stop (): Promise<void>;
	stop (adapters: string[]): Promise<void>;
}