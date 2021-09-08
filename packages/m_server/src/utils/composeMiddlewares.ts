// Interfaces
import { MiddlewareInterface } from "@acai/interfaces"

const composeMiddlewares =
	(middlewares: [MiddlewareInterface, string[] | undefined][]) =>
		(request: any) =>
			middlewares.length > 0 ? middlewares.reverse().reduce(
				(prev, curr) => (value: any) => (curr[0] as any)(value, prev ? prev : request, curr[1]) as any
				, undefined as unknown as any,
			)
				: ((value: any) => request(value))

export default composeMiddlewares