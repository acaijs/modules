import { RouteInterface } from "@acai/router";
import { ServerInterface } from "@acai/interfaces";
import { RequestInterface } from "@acai/interfaces";
import { ResponseInterface } from "@acai/interfaces";
import { MiddlewareInterface } from "@acai/interfaces";
import { ServerRequest } from "../interfaces/serverRequest";
export default class RequestHandler {
    private server;
    private serverRequest;
    private onRequest?;
    constructor(req: ServerRequest, server: ServerInterface, onRequest?: (path: string, method: string) => RequestInterface);
    buildBaseRequest(routes: RouteInterface[]): Promise<RequestInterface | undefined>;
    buildPipeline(request: RequestInterface, globals: MiddlewareInterface[], middlewares: Record<string, MiddlewareInterface>): (request: RequestInterface) => Promise<RequestInterface | ResponseInterface | string | Record<string, unknown>>;
    proccess(request: RequestInterface, curry: (request: RequestInterface) => Promise<RequestInterface | ResponseInterface | string | Record<string, unknown>>): Promise<void>;
    private getProperties;
}
