// Packages
import { MiddlewareInterface } from "@acai/interfaces"

// Utils
import Composable from "./composable"

const composeMiddlewares = (middlewares: [MiddlewareInterface, string[] | undefined][], controller: any) =>
	Composable(middlewares)
		// build arguments
		.map(item => async (request, next) => item[0](await request, await next, item[1]))
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
		// reverse in correct order
		.reverse()
		// compose it into unary
		.compose((prev, curr) => (value) => curr(value, prev || controller))

export default composeMiddlewares
