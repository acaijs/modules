/// <reference types="body-parser" />
// Interfaces
import { AdapterInterface, ClassType, SerializedAdapterInterface, ProviderInterface, MiddlewareType, ServerConfigInterface, ServerInterface, CustomExceptionInterface } from "@acai/interfaces";
// Packages
import * as http from "http";
declare class AdapterHandler {
    // -------------------------------------------------
    // Properties
    // -------------------------------------------------
    readonly adapter: SerializedAdapterInterface;
    // -------------------------------------------------
    // Main methods
    // -------------------------------------------------
    constructor(adapter: SerializedAdapterInterface);
    boot(): Promise<void>;
    shutdown(): Promise<void>;
    onException(error: CustomExceptionInterface, request?: any): Promise<any[] | undefined>;
    onRequest(request: any, precontroller: string | ((...args: any[]) => any), middlewareNames?: string[]): Promise<any[]>;
}
declare class Server implements ServerInterface {
    // -------------------------------------------------
    // Properties
    // -------------------------------------------------
    protected _config: Partial<ServerConfigInterface>;
    protected adapters: Record<string, SerializedAdapterInterface & {
        handler?: AdapterHandler;
    }>;
    // -------------------------------------------------
    // Boot methods
    // -------------------------------------------------
    constructor(config?: Partial<ServerConfigInterface>);
    setConfig(config: Partial<ServerConfigInterface>): void;
    setConfig(adapter: string | string[], config: Partial<ServerConfigInterface>): void;
    getConfig(): Partial<ServerConfigInterface>;
    getConfig(adapter: string): Partial<ServerConfigInterface> | undefined;
    deleteConfig(key: string): void;
    deleteConfig(adapter: string | string[], key: string): void;
    // -------------------------------------------------
    // Provider methods
    // -------------------------------------------------
    addProvider(provider: ProviderInterface): void;
    addProvider(adapter: string | string[], provider: ProviderInterface): void;
    addProviders(providers: ProviderInterface[]): void;
    addProviders(adapter: string | string[], Providers: ProviderInterface[]): void;
    clearProviders(): void;
    clearProviders(adapter: string | string[]): void;
    // -------------------------------------------------
    // Middleware methods
    // -------------------------------------------------
    addMiddleware(id: string, middleware: MiddlewareType): void;
    addMiddleware(adapter: string | string[], id: string, middleware: MiddlewareType): void;
    addMiddlewares(middlewares: Record<string, MiddlewareType>): void;
    addMiddlewares(adapter: string | string[], middlewares: Record<string, MiddlewareType>): void;
    clearMiddlewares(middlewares?: string | string[]): void;
    clearMiddlewares(adapter: string, middlewares?: string | string[]): void;
    // -------------------------------------------------
    // Global middleware methods
    // -------------------------------------------------
    addGlobal(cb: MiddlewareType): void;
    addGlobal(adapter: string | string[], cb: MiddlewareType): void;
    addGlobals(middlewares: MiddlewareType[]): void;
    addGlobals(adapter: string | string[], middlewares: MiddlewareType[]): void;
    clearGlobals(): void;
    clearGlobals(adapter: string | string[]): void;
    // -------------------------------------------------
    // Adapter methods
    // -------------------------------------------------
    addAdapter(name: string, adapter: ClassType<AdapterInterface> | AdapterInterface, config?: Partial<ServerConfigInterface>): void;
    injectAdapter(name: string | string[]): void;
    getAdapter(name: string): SerializedAdapterInterface | undefined;
    removeAdapter(name: string): void;
    // -------------------------------------------------
    // Main methods
    // -------------------------------------------------
    run(adaptersToRun?: string[] | string): Promise<void>;
    stop(adaptersToStop?: string[] | string): Promise<void>;
    isRunning(adaptersToCheck?: string | string[]): Promise<number>;
}
declare class HttpAdapter implements AdapterInterface {
    // -------------------------------------------------
    // Properties
    // -------------------------------------------------
    protected conn: http.Server;
    // -------------------------------------------------
    // Main methods
    // -------------------------------------------------
    boot(config: SerializedAdapterInterface["config"]): Promise<boolean>;
    shutdown(): Promise<void>;
    onRequest: AdapterInterface["onRequest"];
    // -------------------------------------------------
    // Helper methods
    // -------------------------------------------------
    protected getParsedRequest(req: http.IncomingMessage): {
        raw: () => http.IncomingMessage;
        headers: {};
        method: string;
        status: number | undefined;
        url: string;
        body: {};
    };
    protected getMatch(path: string, req: http.IncomingMessage): {
        controller: string | ((...args: any[]) => any);
        middlewares: string[];
        params: Record<string, string>;
        query: Record<string, string | number | boolean>;
    } | undefined;
    getPath(prepath: string): string;
}
export { Server as default, HttpAdapter };
export type { ServerRequest } from "@acai/interfaces";
export { response } from "@acai/utils";
