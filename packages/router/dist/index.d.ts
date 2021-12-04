type methodTypes = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "ANY" | "OPTIONS";
interface RouteInterface<T = Record<string, unknown>> {
    /**
     * url path
     */
    path: string;
    /**
     * file that should be loaded
     */
    file: string | ((...args: any[]) => any);
    /**
     * HTTP Method of the route
     */
    method: methodTypes;
    /**
     * Extra options
     */
    options: T;
}
type BuiltRoute = RouteInterface;
interface RouteOptionsInterface {
    /**
     * Prefix path with given value
     */
    prefix?: string;
    /**
     * Sufix path with given value
     */
    sufix?: string;
    /**
     * Prefix file path with given value
     */
    filePrefix?: string;
    /**
     * Sufix file path with given value
     */
    fileSufix?: string;
    /**
     * Should the path match exactly
     */
    exact?: boolean;
    /**
     * Extra options available
     */
    options: Record<string, any>;
    /**
     * Generic options that can be added
     */
    [key: string]: unknown;
}
type targetMatch = string | ((...args: any[]) => any);
type concactRoute = {
    options: (options: RouteOptionsInterface["options"]) => void;
};
interface RouteModuleInterface {
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
    many(methods: methodTypes[], path: targetMatch, filePath: string, options?: RouteOptionsInterface): void;
    /**
     * ## ANY route
     *
     * Same as calling the object direclty, matches to any http method. Useful for fallback routes or usage withe the frontend.
     *
     * @param {string} path url path
     * @param {string} filePath path where to find the controller
     * @param {RouteOptionsInterface?} options optional options such as middlewares and such
     */
    any(path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;
    /**
     * ## GET route
     *
     * Only accepts routes with the GET HTTP method, also passes the OPTIONS.
     *
     * @param {string} path url path
     * @param {string} filePath path where to find the controller
     * @param {RouteOptionsInterface?} options optional options such as middlewares and such
     */
    get(path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;
    /**
     * ## POST route
     *
     * Only accepts routes with the POST HTTP method, also passes the OPTIONS.
     *
     * @param {string} path url path
     * @param {string} filePath path where to find the controller
     * @param {RouteOptionsInterface?} options optional options such as middlewares and such
     */
    post(path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;
    /**
     * ## PATCH route
     *
     * Only accepts routes with the PATCH HTTP method, also passes the OPTIONS.
     *
     * @param {string} path url path
     * @param {string} filePath path where to find the controller
     * @param {RouteOptionsInterface?} options optional options such as middlewares and such
     */
    patch(path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;
    /**
     * ## PUT route
     *
     * Only accepts routes with the PUT HTTP method, also passes the OPTIONS.
     *
     * @param {string} path url path
     * @param {string} filePath path where to find the controller
     * @param {RouteOptionsInterface?} options optional options such as middlewares and such
     */
    put(path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;
    /**
     * ## DELETE route
     *
     * Only accepts routes with the DELETE HTTP method, also passes the OPTIONS.
     *
     * @param {string} path url path
     * @param {string} filePath path where to find the controller
     * @param {RouteOptionsInterface?} options optional options such as middlewares and such
     */
    delete(path: string, filePath: targetMatch, options?: RouteOptionsInterface): concactRoute;
    /**
     * ## Options
     *
     * Groups all routes inside of it inside of the same context, can be nested unlimited times. Useful to group similar options to a group of routes.
     *
     * @param {RouteOptionsInterface["options"]} options extra options that can be passed to the context that will group the routes
     * @param {() => void} callback callback that will contain all the routes used inside of the context
     */
    options(options: RouteOptionsInterface["options"], callback: () => void): void;
    /**
     * ## Group
     *
     * Similar to the options method, this allows you to easily prefix route's urls, they can be nested indefinitely
     *
     * @param {string} prefix url prefix to be added as prefix into all routes inside of it
     * @param {() => void} callback callback that will contain all the routes used inside of the context
     * @param {RouteOptionsInterface?} options extra options that can be passed to the context that will group the routes
     */
    group(prefix: string, callback: () => void, options?: RouteOptionsInterface): void;
    /**
     * ## Build
     *
     * Responsible for building and delivering a list with all the routes added in the cache.
     *
     * @param {boolean?} clearCache clear all routes after build
     */
    build(clearCache?: boolean): BuiltRoute[];
    /**
     * ## Clear
     *
     * Clear every stored date inside of the route factory. Use in case you want to remove all routes to start process again
     */
    clear(): void;
    /**
     * ## Macro
     *
     * Reusable chunk of code to generate preset routes
     *
     * @param {string} name Name to be used when calling macro
     * @param {Function} callback chunk of logic that will be run when called
     */
    macro(name: string, cb: (...args: any[]) => void): any;
    /**
     * ## Use
     *
     * Use a preset macro implemented earlier
     *
     * @param {string} name Name of the macro to be called
     * @param {...args[]} macroArgs Dinamic defined arguments to be passed to the macro
     */
    use(name: string, ...macroArgs: any[]): void;
}
declare const _default: RouteModuleInterface;
type MethodTypes = methodTypes;
interface RouterConfigInterface {
    /**
     * ### Variable enclose
     *
     * Customize how you should find and match variables present inside of the router.
     */
    variableEnclose?: [
        string,
        string
    ];
    /**
     * ### Options method match
     *
     * Allow the match of options method in any route method
     */
    allowOptionsMatch?: boolean;
}
/**
 * # Router
 *
 * Get a list of routes and find the correspondent based on the given routes.
 *
 * @param {string} path current url path to be analyzed against all routes
 * @param {string} method HTTP method to match to
 * @param {RouteInterface[]} routes list of available routes that can be matched
 * @param {RouterConfigInterface?} config extra config options to customize the router behaviour
 */
declare const routerModule: <Options = Record<string, string>>(path: string, method: MethodTypes, routes: RouteInterface[], config?: RouterConfigInterface) => {
    options: Options;
    variables: Record<string, string | string[]>;
    query: Record<string, string | number | boolean>;
    path: string;
    file: string | ((...args: any[]) => any);
    method: MethodTypes;
} | undefined;
/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/
export { _default as route, routerModule as router, RouteInterface };
