// Packages
import { MiddlewareInterface } from "@acai/interfaces"

// Utils
import Composable from "./composable"

const composeMiddlewares = (middlewares: [MiddlewareInterface, string[] | undefined][]) =>
	middlewares.length === 0 ? v => v : Composable(middlewares)
		// build arguments
		.map(item => async (request, next) => {
			const response = item[0](await request, await (next || (v => v)), item[1])

			return response
		})
		// safe thread it
		.map(item => async (v: any, n: any) => {
			try {
				const response = await item(v, n)
				if (response) return response
			}
			catch(e) {
				(e as any).request = v
				throw e
			}
		})
		// reverse in correct order
		.reverse()
		// compose it into unary
		.compose((prev, curr) => curr(prev))

export default composeMiddlewares
