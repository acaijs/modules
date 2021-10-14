// Interfaces
import methodTypes 				from "../interfaces/method";
import RouteInterface			from "../interfaces/route";
import RouteModuleInterface		from "../interfaces/routeMethod";
import RouteOptionsInterface 	from "../interfaces/routeOptions";

// Utils
import { addRoute, clearRoutes, getMacro, getRoutes }	from "../utils/context";
import { addCallback, clearCallbacks, getCallbacks }	from "../utils/context";
import { clearContext, getContext, setContext }			from "../utils/context";
import { setMacro }										from "../utils/context";

// -------------------------------------------------
// HTTP Methods
// -------------------------------------------------

const routeAnyMethod = (path: string, filePath: string, options: Partial<RouteOptionsInterface> = {}) => {
	return addRoute(filePath, path, "ANY", options);
};

const routeGetMethod = (path: string, filePath: string, options: Partial<RouteOptionsInterface> = {}) => {
	return addRoute(filePath, path, "GET", options);
};

const routePostMethod = (path: string, filePath: string, options: Partial<RouteOptionsInterface> = {}) => {
	return addRoute(filePath, path, "POST", options);
};

const routePatchMethod = (path: string, filePath: string, options: Partial<RouteOptionsInterface> = {}) => {
	return addRoute(filePath, path, "PATCH", options);
};

const routePutMethod = (path: string, filePath: string, options: Partial<RouteOptionsInterface> = {}) => {
	return addRoute(filePath, path, "PUT", options);
};

const routeDeleteMethod = (path: string, filePath: string, options: Partial<RouteOptionsInterface> = {}) => {
	return addRoute(filePath, path, "DELETE", options);
};

// -------------------------------------------------
// Helpers
// -------------------------------------------------

const routeMacro = (name: string, callback: (...args: any[]) => void) => {
	setMacro(name, callback);
}

const routeUseMacro = async (name: string, ...args: any[]) => {
	const callback = getMacro(name);
	await callback(...args);
}

const routeOptions = (options: RouteOptionsInterface["options"], callback: () => void) => {
	const c 			= { ...getContext(), options: {... options} };
	const lastoptions	= {...getContext().options};

	addCallback(() => {
		setContext(c, lastoptions);

		callback();
	});
}

/**
 * Just a nitpick here - this is a pretty brittle & inefficient implementation
 * You're unnecessarily looping through the method array way too many times.
 * It also doesn't support a lot of HTTP types (although those are very uncommon)
 */
const routeMany = (method: methodTypes[], path: string, filePath: string, options: Partial<RouteOptionsInterface> = {}) => {
	if (method.includes("GET"))
		routeGetMethod(path, filePath, options);
	if (method.includes("PUT"))
		routePutMethod(path, filePath, options);
	if (method.includes("POST"))
		routePostMethod(path, filePath, options);
	if (method.includes("PATCH"))
		routePatchMethod(path, filePath, options);
	if (method.includes("DELETE"))
		routeDeleteMethod(path, filePath, options);
}

const routeGroup = (prefix: string, callback: () => void, options?: RouteOptionsInterface) => {
	const cprefix 		= (getContext().prefix === undefined ? "" : getContext().prefix) + (prefix || "");
	const c 			= { ...getContext(), ...options, prefix: cprefix };
	const lastoptions	= {...getContext().options};

	addCallback(() => {
		setContext(c, lastoptions);

		callback();
	});
}

const routeBuild = <T = Record<string, unknown>>(clearCache = true) => {
	let cbs = getCallbacks();

	while (cbs.length > 0) {
		clearCallbacks();

		// run all groups
		for (let i = 0; i < cbs.length; i += 1) {
			cbs[i]();
		}

		// break loop if no callbacks left
		cbs = getCallbacks();
	}

	// build components
	const routes = getRoutes();

	// clear registered routes
	if (clearCache) clearRoutes();

	// filter repeated routes
	const filteredroutes = [] as typeof routes;
	routes.reverse().forEach(i => {if (!filteredroutes.find(x => x.path === i.path && x.method === i.method)) filteredroutes.push(i) });
	return filteredroutes.reverse() as RouteInterface<T>[];
}

const clearMethod = () => {
	clearRoutes();
	clearContext();
}

// -------------------------------------------------
// Add default macro
// -------------------------------------------------

/**
 * Correct me if I'm wrong here, but it's a bit disadvantageous to rely on a global context here:
 * 	- you can't do something like `const usersGroup = routeGroup(/users);` in file1 and import that into the main file
 * 	- it seems like you're reliant on all routes to be defined in one main file sequentially without imports
 * 	- (it's kind of like you're forced to write raw javascript code that has to be executed sequentially since the AST relies
 * 		on some type of context to keep track of where you are)
 */

routeMacro("resource", (name: string, file: string) => {
	routeGetMethod(`${name}`, 	`${file}@index`);
	routePostMethod(`${name}`, 	`${file}@store`);

	routeGroup("/{id}", () => {
		routeGetMethod("/", 	`${file}@show`);
		routePatchMethod("/", 	`${file}@update`);
		routePutMethod("/", 	`${file}@update`);
		routeDeleteMethod("/", 	`${file}@destroy`);
	});
});

// -------------------------------------------------
// Exports
// -------------------------------------------------

const route 	= routeAnyMethod as RouteModuleInterface;
route.any		= routeAnyMethod;
route.get		= routeGetMethod;
route.post		= routePostMethod;
route.put		= routePutMethod;
route.patch		= routePatchMethod;
route.delete	= routeDeleteMethod;
route.options 	= routeOptions;
route.group		= routeGroup;
route.many		= routeMany;
route.build		= routeBuild;
route.clear		= clearMethod;
route.macro		= routeMacro;
route.use		= routeUseMacro;

export default route as RouteModuleInterface;
