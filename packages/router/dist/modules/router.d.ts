import RouteInterface from "../interfaces/route";
import MethodTypes from "../interfaces/method";
import RouterConfigInterface from "../interfaces/routerConfig";
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
declare const routerModule: <Options = Record<string, string>>(path: string, method: MethodTypes, routes: RouteInterface[], config?: RouterConfigInterface | undefined) => {
    options: Options;
    variables: Record<string, string | string[]>;
    path: string;
    file: string | ((...args: any[]) => any);
    method: MethodTypes;
} | undefined;
export default routerModule;
