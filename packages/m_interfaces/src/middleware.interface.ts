// Interfaces
import RequestInterface 	from "./request.interface"
import ResponseInterface 	from "./response.interface"

type MiddlewareResponse = RequestInterface | ResponseInterface | string | Record<string, unknown>;
type nextWrap 			= (request: RequestInterface) => MiddlewareResponse | Promise<MiddlewareResponse>;

type MiddlewareType = (request: RequestInterface, next: nextWrap, params?: string[]) => MiddlewareResponse | Promise<MiddlewareResponse>;

export default MiddlewareType