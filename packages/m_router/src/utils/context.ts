// Interfaces
import Options 					from "../interfaces/routeOptions"
import Route 					from "../interfaces/route"
import methodTypes				from "../interfaces/method"
import RouteOptionsInterface	from "../interfaces/routeOptions"

// -------------------------------------------------
// Properties
// -------------------------------------------------

let context		: Options 									= {options:{}}
let routes		: Route[] 									= []
let cbs			: (() => void)[] 							= []
let macros		: Record<string, (...args: any[]) => void> 	= {}

// -------------------------------------------------
// Context
// -------------------------------------------------

export const getContext = (): Options => context

export const setContext = ({options, ...newContext}: Partial<Options>, lastoptions: Options["options"]): void => {
	const newoptions = {...lastoptions}

	if (options) {
		Object.keys(options).forEach(key => {
			if (!key.match(/^!/)) {
				if (Array.isArray(options[key]) && Array.isArray(lastoptions[key])) {
					const arr = options[key] as string[]
					newoptions[key] = [...(lastoptions[key] as string[]).filter(i => !arr.find(x => x === i)), ...arr]
				}
				else if (typeof options[key] === "object" && typeof lastoptions[key] === "object") {
					newoptions[key] = {...(lastoptions[key] as Record<string, string>), ...(options[key] as Record<string, string>)}
				}
				else {
					newoptions[key] = options[key]
				}
			}
			else {
				newoptions[key.replace(/^!/, "")] = options[key]
			}
		})
	}

	context = { ...newContext, options: {...newoptions} }
}

export const clearContext = (): void => {
	context = {options:{}}
}

// -------------------------------------------------
// Routes
// -------------------------------------------------

export const getRoutes = (): typeof routes => routes

export const addRoute = (view: string, path: string, method: methodTypes, options: Partial<Options>) => {
	// gather data
	const { prefix, ..._context } = getContext()
	const completepath = `/${(prefix === undefined ? "/" : prefix) + path}`.replace(/\/$/, "").replace(
		/^(\\+|\/+)/gm,
		"/",
	)
	const clearview = typeof view === "string" ? view
		.replace(/(\\+|\/+)/gm, "/")
		.replace(/(\\|\/)$/gm, "")
		.replace(/^(\\|\/)/gm, ""):view

	// push to routes
	routes.push({
		file: clearview,
		path: completepath,
		method,
		options: {
			..._context.options,
			...options,
		},
	})

	const index = routes.length - 1

	return {
		options: (newoptions: RouteOptionsInterface["options"]) => {
			routes[index].options = {
				...routes[index].options,
				...newoptions,
			}
		},
	}
}

export const clearRoutes = (): void => {
	routes = []
}

// -------------------------------------------------
// Context
// -------------------------------------------------

export const getCallbacks = (): typeof cbs => cbs

export const addCallback = (newCallback: () => void): void => {
	cbs.push(newCallback)
}

export const clearCallbacks = (): void => {
	cbs = []
}

// -------------------------------------------------
// Macros
// -------------------------------------------------

export const getMacro = (name: string) => {
	if (!macros[name]) {
		throw new Error(`Macro '${name}' not found`)
	}

	return macros[name]
}

export const setMacro = (name: string, callback: (...args: any[]) => void) => {
	macros[name] = callback
}

export const clearMacros = () => macros = {}
