// Interfaces
import methodTypes 				from "./method"
import BuiltRoute				from "./route"
import RouteOptionsInterface 	from "./routeOptions"
type targetMatch = string | ((...args: any[]) => any);

type concactRoute = {options: (options: RouteOptionsInterface["options"]) => void};

export default interface RouteModuleInterface {
	/**
	 * ## ANY route
	 *
	 * Add a route that matches to any http method, useful for fallback routes or usage with the frontend.
	 */
	(path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;

	/**
	 * ## Many route
	 *
	 * Defines the same route for multiple HTTP methods
	 *
	 * @param {string[]} methods HTTP methods
	 * @param {string} path url path
	 * @param {string} filePath path where to find the controller
	 * @param {RouteOptionsInterface?} options optional options such as middlewares and such
	 */
	many (methods: methodTypes[], path: targetMatch, filePath: string, options?: RouteOptionsInterface): void;

	/**
	 * ## ANY route
	 *
	 * Same as calling the object direclty, matches to any http method. Useful for fallback routes or usage withe the frontend.
	 *
	 * @param {string} path url path
	 * @param {string} filePath path where to find the controller
	 * @param {RouteOptionsInterface?} options optional options such as middlewares and such
	 */
	any (path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;

	/**
	 * ## GET route
	 *
	 * Only accepts routes with the GET HTTP method, also passes the OPTIONS.
	 *
	 * @param {string} path url path
	 * @param {string} filePath path where to find the controller
	 * @param {RouteOptionsInterface?} options optional options such as middlewares and such
	 */
	get (path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;

	/**
	 * ## POST route
	 *
	 * Only accepts routes with the POST HTTP method, also passes the OPTIONS.
	 *
	 * @param {string} path url path
	 * @param {string} filePath path where to find the controller
	 * @param {RouteOptionsInterface?} options optional options such as middlewares and such
	 */
	post (path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;

	/**
	 * ## PATCH route
	 *
	 * Only accepts routes with the PATCH HTTP method, also passes the OPTIONS.
	 *
	 * @param {string} path url path
	 * @param {string} filePath path where to find the controller
	 * @param {RouteOptionsInterface?} options optional options such as middlewares and such
	 */
	patch (path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;

	/**
	 * ## PUT route
	 *
	 * Only accepts routes with the PUT HTTP method, also passes the OPTIONS.
	 *
	 * @param {string} path url path
	 * @param {string} filePath path where to find the controller
	 * @param {RouteOptionsInterface?} options optional options such as middlewares and such
	 */
	put (path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;

	/**
	 * ## DELETE route
	 *
	 * Only accepts routes with the DELETE HTTP method, also passes the OPTIONS.
	 *
	 * @param {string} path url path
	 * @param {string} filePath path where to find the controller
	 * @param {RouteOptionsInterface?} options optional options such as middlewares and such
	 */
	delete (path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;

	/**
	 * ## Options
	 *
	 * Groups all routes inside of it inside of the same context, can be nested unlimited times. Useful to group similar options to a group of routes.
	 *
	 * @param {RouteOptionsInterface["options"]} options extra options that can be passed to the context that will group the routes
	 * @param {() => void} callback callback that will contain all the routes used inside of the context
	 */
	options (options: RouteOptionsInterface["options"], callback: () => void): void;

	/**
	 * ## Group
	 *
	 * Similar to the options method, this allows you to easily prefix route's urls, they can be nested indefinitely
	 *
	 * @param {string} prefix url prefix to be added as prefix into all routes inside of it
	 * @param {() => void} callback callback that will contain all the routes used inside of the context
	 * @param {RouteOptionsInterface?} options extra options that can be passed to the context that will group the routes
	 */
	group (prefix: string, callback: () => void, options?: RouteOptionsInterface): void;

	/**
	 * ## Build
	 *
	 * Responsible for building and delivering a list with all the routes added in the cache.
	 *
	 * @param {boolean?} clearCache clear all routes after build
	 */
	build (clearCache?: boolean): BuiltRoute[];

	/**
	 * ## Clear
	 *
	 * Clear every stored date inside of the route factory. Use in case you want to remove all routes to start process again
	 */
	clear (): void;

	/**
	 * ## Macro
	 *
	 * Reusable chunk of code to generate preset routes
	 *
	 * @param {string} name Name to be used when calling macro
	 * @param {Function} callback chunk of logic that will be run when called
	 */
	macro (name: string, cb: (...args: any[]) => void);

	/**
	 * ## Use
	 *
	 * Use a preset macro implemented earlier
	 *
	 * @param {string} name Name of the macro to be called
	 * @param {...args[]} macroArgs Dinamic defined arguments to be passed to the macro
	 */
	use (name: string, ...macroArgs: any[]): void;
}