// Interfaces
import RouteInterface 			from "../interfaces/route";
import MethodTypes	 			from "../interfaces/method";
import RouterConfigInterface 	from "../interfaces/routerConfig";

/**
 * In my opinion, doing the routes based on string matching (for files) essentially
 * makes typescript useless for routing with AcaiJS.
 * You no longer get any compile-time checking - everything is prone to failing at run-time.
 * 
 * Additionally, you're doing your own version dependency resolution which is always going to be
 * less efficient than node's module resolution. The bigger concern is that your dependency resolution
 * is happening at run-time for each request the server receives whereas when relying on Node, dependency
 * resolution happens on initialization (unless you're doing lazy module resolution except
 * there are very rare benefits in a server-side application)
 * 
 * For example, in Acai, typescript isn't able to help at all if you ever need to do some refactoring of your routes
 * since all routes are defined with strings that aren't checked until that route is specifically hit during runtime
 */

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
const routerModule = <Options = Record<string, string>> (path: string, method: MethodTypes, routes: RouteInterface[], config?: RouterConfigInterface) => {
	// prepare data
	const sanitizedpath 		= path.replace(/(\\|\/)^/, "");
	const variablematch 		= new RegExp(`${config?.variableEnclose || "{"}\\s*\\S+\\??\\s*${config?.variableEnclose || "}"}`);
	const optionalVariableMatch = new RegExp(`\\?{1}\\s*${config?.variableEnclose || "}"}`);
	let variables	 			= {} as Record<string, string | string[]>;

	/**
	 * While this isn't a huge performance concern, this is pretty inefficient
	 * Doing a O(n) search through all the routes and doing the exact same string processing
	 * is pretty inefficient. Look into using something like a `trie` instead and do 
	 * as much string preprocessing before once only.
	 * Ideally, the efficiency should be able to close to O(1) - imagine if there were 1,000 routes 
	 * (which is possible for an API with lots of versions - although arguably not great design)
	 * it would need to do a lot more calculation necessary.
	 * 
	*/
	// Match routes
	const route = routes.find((route) => {
		variables = {};
		const splitpath = route.path.split("/").filter(i => i !== "");
		const possibleMatch = sanitizedpath.split("/").filter(i => i !== "");

		// check route http method
		if (method !== route.method && !(method === "OPTIONS") && route.method !== "ANY") return false;

		// check by length
		if (possibleMatch.length > splitpath.length && splitpath[splitpath.length - 1] !== "*") {
			return false;
		}

		// filter by the actual route
		const matches = splitpath.filter((part, index) => {
			const isVar 		= variablematch.test(part);
			const isOptionalVar = optionalVariableMatch.test(part);
			const varName 		= part.replace(new RegExp(`${config?.variableEnclose || "{"}\\s*`), "").replace(new RegExp(`\\??\\s*${config?.variableEnclose || "}"}`), "");

			if (isVar) {
				if (possibleMatch[index]) {
					variables[varName] = possibleMatch[index];
				}

				if (isOptionalVar) {
					return false;
				}
				else {
					return !possibleMatch[index];
				}
			}
			else {
				return part !== possibleMatch[index];
			}
		}).length;

		// add extra if necessary
		if (!matches && splitpath[splitpath.length - 1] === "*" && possibleMatch.length > splitpath.length) {
			variables["*"] = possibleMatch.splice(0, splitpath.length);
		}

		return !matches;
	});

	if (route)
		return {...route, options: route.options as Options, variables};
}

export default routerModule;
