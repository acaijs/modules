// Interfaces
import RequestInterface 	from "./request"
import ResponseInterface 	from "./response"

type MiddlewareResponse = RequestInterface | ResponseInterface | string | Record<string, unknown>;
type nextWrap 			= (request: RequestInterface) => MiddlewareResponse | Promise<MiddlewareResponse>;

type MiddlewareType = (request: RequestInterface, next: nextWrap, params?: string[]) => MiddlewareResponse | Promise<MiddlewareResponse>;

type MiddlewareInterface = { onApply: MiddlewareType } | MiddlewareType

export default MiddlewareInterface