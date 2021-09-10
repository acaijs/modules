// Interfaces
import { MiddlewareInterface } from "@acai/interfaces"

const composeMiddlewares =
	(middlewares: [MiddlewareInterface, string[] | undefined][]) =>
		(controller: any) =>
			middlewares.length > 0 ? middlewares.reverse().reduce(
				(prev, curr) => (value: any) => (curr[0] as any)(value, prev ? prev : controller, curr[1]) as any
				, undefined as unknown as any,
			)
				: ((request: any) => controller(request))

export default composeMiddlewares