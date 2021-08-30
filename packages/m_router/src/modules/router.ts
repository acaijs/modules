// Interfaces
import RouteInterface from "../interfaces/route"
import MethodTypes from "../interfaces/method"
import RouterConfigInterface from "../interfaces/routerConfig"

// Utils
import buildQueryParams from "../utils/buildQueryParams"

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
const routerModule = <Options = Record<string, string>> (path: string, method: MethodTypes, routes: RouteInterface[], config: RouterConfigInterface = {}) => {
	// prepare data
	const sanitizedpath = path.replace(/(\\|\/)^/, "")
	const [clearpath, queryParams] = buildQueryParams(sanitizedpath)
	const variablematch = new RegExp(`${config.variableEnclose || "{"}\\s*\\S+\\??\\s*${config.variableEnclose || "}"}`)
	const optionalVariableMatch = new RegExp(`\\?{1}\\s*${config.variableEnclose || "}"}`)
	let variables = {} as Record<string, string | string[]>

	// Match routes
	const route = routes.find((route) => {
		variables = {}
		const splitpath = route.path.split("/").filter(i => i !== "")
		const possibleMatch = clearpath.split("/").filter(i => i !== "")

		// check route http method
		if (method !== route.method && !(method === "OPTIONS" && config.allowOptionsMatch !== false) && route.method !== "ANY") return false

		// check by length
		if (possibleMatch.length > splitpath.length && splitpath[splitpath.length - 1] !== "*") {
			return false
		}

		// filter by the actual route
		const matches = splitpath.filter((part, index) => {
			const isVar 		= variablematch.test(part)
			const isOptionalVar = optionalVariableMatch.test(part)
			const varName 		= part.replace(new RegExp(`${config.variableEnclose || "{"}\\s*`), "").replace(new RegExp(`\\??\\s*${config.variableEnclose || "}"}`), "")

			if (isVar) {
				if (possibleMatch[index]) {
					variables[varName] = possibleMatch[index]
				}

				if (isOptionalVar) {
					return false
				}
				else {
					return !possibleMatch[index]
				}
			}
			else {
				return part !== possibleMatch[index]
			}
		}).length

		// add extra if necessary
		if (!matches && splitpath[splitpath.length - 1] === "*" && possibleMatch.length > splitpath.length) {
			variables["*"] = possibleMatch.splice(0, splitpath.length)
		}

		return !matches
	})

	if (route)
		return {...route, options: route.options as Options, variables, query: queryParams}

	return undefined
}

export default routerModule