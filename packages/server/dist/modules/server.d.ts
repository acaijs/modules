/// <reference types="node" />
import * as http from "http";
import { ServerInterface } from "@acai/interfaces";
import { ServerConfigInterface } from "@acai/interfaces";
import { ProviderInterface } from "@acai/interfaces";
import { MiddlewareInterface } from "@acai/interfaces";
import { RequestInterface } from "@acai/interfaces";
import { RouteInterface } from "@acai/router";
export default class Server implements ServerInterface {
    protected onRequest?: (path: string, method: string) => RequestInterface;
    protected _config: Partial<ServerConfigInterface>;
    protected routes: RouteInterface[];
    protected server: http.Server;
    protected providers: ProviderInterface[];
    protected middlewares: Record<string, MiddlewareInterface>;
    protected globals: MiddlewareInterface[];
    constructor(config?: Partial<ServerConfigInterface>);
    setConfig(config: Partial<ServerConfigInterface>): void;
    get config(): Partial<ServerConfigInterface>;
    addProvider(Provider: ProviderInterface): void;
    addProviders(Providers: ProviderInterface[]): void;
    getProviders(): ProviderInterface[];
    clearProviders(): void;
    addMiddleware(id: string, cb: MiddlewareInterface): void;
    addMiddlewares(middlewares: Record<string, MiddlewareInterface>): void;
    getMiddlewares(): Record<string, MiddlewareInterface>;
    clearMiddlewares(): void;
    addGlobal(cb: MiddlewareInterface): void;
    addGlobals(globals: MiddlewareInterface[]): void;
    getGlobals(): MiddlewareInterface[];
    clearGlobals(): void;
    run(port?: number, hostname?: string): Promise<void>;
    stop(): Promise<void>;
}
