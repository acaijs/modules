// Packages
import { MiddlewareInterface } from "@acai/interfaces"

// Utils
import Composable from "./composable"

const composeMiddlewares = (middlewares: [MiddlewareInterface, string[] | undefined][], controller: any) =>
	Composable(middlewares)
		// build arguments
		.map(item => (request, next) => item[0](request, next, item[1]))
		// turn it binary
		.map(item => (value:any, next: any) => item(value, next || controller))
		// safe thread it
		.map(item => (v: any, n: any) => {
			try {
				return item(v, n)
			}
			catch(e) {
				(e as any).request = v
				throw e
			}
		})
		// compose it into unary
		.compose((prev, curr) => curr(prev))

export default composeMiddlewares