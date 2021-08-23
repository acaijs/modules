// Interfaces
import { MiddlewareInterface } from "@acai/interfaces"

const composeMiddlewares = (middlewares: MiddlewareInterface[]) => (request: any) => middlewares.reverse().reduce(
	(prev, curr) => (value: any) => (curr as any)(value, prev ? prev : request) as any
	, undefined as unknown as any) || ((value: any) => request(value))

export default composeMiddlewares