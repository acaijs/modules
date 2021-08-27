// Interfaces
import ResponseInterface 	from "./response"

type MiddlewareResponse = any | ResponseInterface | string | Record<string, unknown>;
type nextWrap 			= (request: any) => MiddlewareResponse | Promise<MiddlewareResponse>;

type MiddlewareType = (request: any, next: nextWrap, params?: string[]) => MiddlewareResponse | Promise<MiddlewareResponse>;

type MiddlewareInterface = { onApply: MiddlewareType } | MiddlewareType

export default MiddlewareInterface