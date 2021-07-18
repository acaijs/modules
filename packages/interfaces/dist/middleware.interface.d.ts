import RequestInterface from "./request.interface";
import ResponseInterface from "./response.interface";
declare type MiddlewareResponse = RequestInterface | ResponseInterface | string | Record<string, unknown>;
declare type nextWrap = (request: RequestInterface) => MiddlewareResponse | Promise<MiddlewareResponse>;
declare type MiddlewareType = (request: RequestInterface, next: nextWrap, params?: string[]) => MiddlewareResponse | Promise<MiddlewareResponse>;
export default MiddlewareType;
