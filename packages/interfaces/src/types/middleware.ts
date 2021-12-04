// Interfaces
import ServerRequest from "../interfaces/request"
import ResponseInterface from "../interfaces/response"

type MiddlewareResponse = any | ResponseInterface | string | Record<string, unknown>;
type nextWrap 			= (request: ServerRequest) => MiddlewareResponse | Promise<MiddlewareResponse>;

export type MiddlewareCbType = (request: ServerRequest, next: nextWrap, params: string[]) => MiddlewareResponse | Promise<MiddlewareResponse>;
export type MiddlewareClassType = { onApply: MiddlewareCbType }
type MiddlewareType = MiddlewareCbType | MiddlewareClassType

export default MiddlewareType