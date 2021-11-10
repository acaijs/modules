// Interfaces
import ServerRequest from "./request"
import ResponseInterface from "./response"

type MiddlewareResponse = any | ResponseInterface | string | Record<string, unknown>;
type nextWrap 			= (request: ServerRequest) => MiddlewareResponse | Promise<MiddlewareResponse>;

type MiddlewareType = (request: ServerRequest, next: nextWrap, params?: string[]) => MiddlewareResponse | Promise<MiddlewareResponse>;

type MiddlewareInterface = { onApply: MiddlewareType } | MiddlewareType

export default MiddlewareInterface