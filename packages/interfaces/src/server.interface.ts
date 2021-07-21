// Interfaces
import ServerConfigInterface	from "./server.config.interface";
import MiddlewareType			from "./middleware.interface";
import ProviderInterface		from "./provider.interface";

export default interface ServerInterface {
	// -------------------------------------------------
	// Getter methods
	// -------------------------------------------------

	config: Partial<ServerConfigInterface>;

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
	/**
	 * ### Add providers
	 *
	 * Add multiple providers to be run when the server starts
	 *
	 * @param {ProviderInterface} provider provider class (not instance)
	 */
	addProviders (providers: ProviderInterface[]) : void;
	/**
	 * ### Get providers
	 *
	 * Get all the providers instances
	 */
	getProviders () : ProviderInterface[];

	/**
	 * ### Clear providers
	 *
	 * Remove all providers
	 */
	clearProviders () : void;

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
	/**
	 * ### Add multiple middlewares
	 *
	 * Add a list scoped middleware to run for certain routes. They are identified by their id.
	 *
	 * @param {Record<string, MiddlewareType>} middlewares
	 */
	addMiddlewares (middlewares: Record<string, MiddlewareType>) : void;
	/**
	 * ### Get middlewares
	 *
	 * Get all middlewares added to the server instance
	 */
	getMiddlewares () : Record<string, MiddlewareType>;
	/**
	 * ### Clear middlewares
	 *
	 * Clear all middlewares added to the server instance
	 */
	clearMiddlewares (id?: string | string[]) : void;

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
	/**
	 * ### Add globals
	 *
	 * Add a list of global middlewares to run for all routes.
	 *
	 * @param {string} id
	 * @param {MiddlewareType} middleware
	 */
	addGlobals (middlewares: MiddlewareType[]) : void;
	/**
	 * ### Add globals
	 *
	 * Get all of the global middlewares added to server instance.
	 *
	 * @param {string} id
	 * @param {MiddlewareType} middleware
	 */
	getGlobals () : MiddlewareType[];
	/**
	 * ### Clear globals
	 *
	 * Clear all global middlewares added to the server instance
	 */
	clearGlobals (id?: string | string[]) : void;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	/**
	 * ### Run
	 *
	 * Actually start the server instance
	 */
	run (): Promise<void>;

	/**
	 * ### Stop
	 *
	 * Turn off server instance to accept requests
	 */
}