// Interfaces
import { MiddlewareInterface } from "@acai/interfaces"

const composeMiddlewares = (middlewares: MiddlewareInterface[], request: any) => middlewares.reduce(
	(prev, curr) => (value: any) => (curr as any)(value, prev ? prev : request) as any
	, undefined as unknown as MiddlewareInterface)

export default composeMiddlewares