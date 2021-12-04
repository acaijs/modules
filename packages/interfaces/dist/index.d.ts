interface ServerRequest<RawRequest = any> {
    /**
     * Represents request metadata content
     */
    headers: Record<string, string>;
    /**
     * Resource coming from client
     */
    body: any;
    /**
     * Method is the connection method made to the request (may not be applied to all server adapters)
     */
    method: string;
    /**
     * Query is a immutable side effect that serves organization. Such as pagination, perpage, filters, etc
     */
    query: Record<string, string | boolean | number>;
    /**
     * Params are resource identifiers, used by the request to find current requested data
     */
    params: Record<string, string>;
    /**
     * The path used to identify which controller to be used
     */
    url: string;
    /**
     * Raw request data sent by the adapter
     */
    raw: () => RawRequest;
    /**
     * Status number that can be correlated to a manual assertion on the adapter
     */
    status?: number;
    /**
     * Controller information given by the adapter. This is injected automatically by Açaí, so you don't
     * have to handle it in the adapter
     */
    controller: string | ((app: ServerRequest) => any);
}
interface ResponseInterface {
    status?: number;
    body?: string;
    headers?: Record<string, number | boolean | string>;
}
type MiddlewareResponse = any | ResponseInterface | string | Record<string, unknown>;
type nextWrap = (request: ServerRequest) => MiddlewareResponse | Promise<MiddlewareResponse>;
type MiddlewareCbType = (request: ServerRequest, next: nextWrap, params: string[]) => MiddlewareResponse | Promise<MiddlewareResponse>;
type MiddlewareClassType = {
    onApply: MiddlewareCbType;
};
type MiddlewareType = MiddlewareCbType | MiddlewareClassType;
type MiddlewareInterface = MiddlewareType;
interface ProviderInterface {
    /**
     * Allows you to boot services (database, mailing, etc) before the server actually starts.
     *
     * @param {ServerInterface} server current server instance
     */
    boot?(server: SerializedAdapterInterface): Promise<void> | void;
    /**
     * Runs after the server boot method is called, you can use this to tell services you are ready to receive data
     *
     * @param {ServerInterface} server current server instance
     */
    ready?(server: SerializedAdapterInterface): Promise<void> | void;
    /**
     * Runs before server shutdowns, you can use this to dispose of any service you won't need anymore
     *
     * @param {ServerInterface} server current server instance
     */
    shutdown?(server: SerializedAdapterInterface): Promise<void> | void;
    /**
     * Allows you to handle specific errors in their provider scope, for example. You could create
     * a validator provider where you could customize validation errors.
     *
     * @param data
     */
    onError?(data: {
        error: CustomExceptionInterface;
        request: ServerRequest;
        server: SerializedAdapterInterface;
    }): Promise<unknown> | unknown;
}
interface ServerConfigInterface {
    /** Encryption key used for cookies and other internal services of the server */
    key: string;
    /** Prefix that can help you scope files that can be used as controllers */
    filePrefix: string;
    /** Prefix that will close the scope of files that can be loaded with the response helper */
    viewPrefix: string;
    /** Domain for the server */
    hostname: string;
    /** Specific port for the domain */
    port: number;
    /** Generic configuration an adapter may have */
    [key: string]: any;
}
interface AdapterInterface {
    /**
     * ### Boot
     *
     * Request of the server to the adapter boot, use this to actually start the adapter, do not use constructor for that!
     *
     * @param config
     */
    boot(config: Partial<ServerConfigInterface>): Promise<boolean> | boolean;
    /**
     * ### Shutdown
     *
     * Shutdown adapter and remove any pending services online
     */
    shutdown(): Promise<void> | void;
    /**
     * ### On request
     *
     * This method allows you to bind a callback that you can call everytime you receive a request,
     * booting the main server. The return of this callback will be the response to be sent by the server.
     *
     * @param callback Call this function when you receive a request from the server
     */
    onRequest(onRequestStart: (request: ServerRequest, controller: string | ((req: ServerRequest) => any | Promise<any>), middlewares?: string[]) => any, safeThread: (cb: () => Promise<any>) => Promise<any>): Promise<void> | void;
}
interface SerializedAdapterInterface {
    // adapter settings
    name: string;
    adapter: AdapterInterface;
    config: ServerConfigInterface;
    // adapter actors
    providers: ProviderInterface[];
    middlewares: Record<string, MiddlewareInterface>;
    globals: MiddlewareInterface[];
    // adapter info
    running: boolean;
}
interface CustomExceptionInterface<Request = ServerRequest> extends Error {
    /**
     * Request data in case the exception was thrown during it. Only applicable during exceptions thrown during request.
     */
    request?: Request;
    /**
     * Extra data to be sent along exception
     */
    data?: any;
    /**
     * Reports error to the server console.
     */
    shouldReport?: boolean;
    /**
     * Saves error log and stack to a file inside the server storage.
     */
    shouldSerialize?: boolean;
    /**
     * Status error to be displayed for the user as response.
     */
    status?: number;
    /**
     * **Be careful when using this**
     * Closes server, can be used when something that goes wrong would prevent the normal behaviour of your server. For example, your database won't connect or a proxy wans't succesful.
     */
    critical?: boolean;
    /**
     * Preserve any changes made to the request. If an error has occured during a middleware, it may not have the full flow you may expect
     * - global: only global middlewares
     * - all: globals and local middlewares
     * - none: don't preserve
     */
    preserve?: "global" | "all" | "none";
    /**
     * A way to categorize your errors so you can group them into subsets that can easily be handled together. Such as: route, validation, database, etc.
     */
    type?: string;
    /**
     * Method that overwrites the server original error dump to the console
     */
    report?(info: {
        server: SerializedAdapterInterface;
        error: CustomExceptionInterface;
        request: Request;
    }): void;
    /**
     * Responsible for rendering a response to the user
     */
    render?(info: {
        server: SerializedAdapterInterface;
        error: CustomExceptionInterface;
        request: Request;
    }): unknown;
}
interface ServerInterface {
    // -------------------------------------------------
    // Config methods
    // -------------------------------------------------
    /**
     * ### Set config
     *
     * Set a config to be used by all adapters
     *
     * @param {Partial<ServerConfigInterface>} config
     */
    setConfig(config: Partial<ServerConfigInterface>): void;
    /**
     * ### Set config
     *
     * Set a config to be used by predetermined adapters
     *
     * @param {string | string[]} adapter
     * @param {Partial<ServerConfigInterface>} config
     */
    setConfig(adapter: string | string[], config: Partial<ServerConfigInterface>): void;
    /**
     * ### Get config
     *
     * Get a config destined to be injected in all adapters
     *
     * @param {string} adapter
     */
    getConfig(): Partial<ServerConfigInterface>;
    /**
     * ### Get config
     *
     * Get a config destined to a specific adapter
     *
     * @param {string} adapter
     */
    getConfig(adapter: string): Partial<ServerConfigInterface> | undefined;
    /**
     * ### Delete config
     *
     * Delete config present in all adapters
     *
     * @param {string} key The name of the config to be deleted
     */
    deleteConfig(key: string): void;
    /**
     * ### Delete config
     *
     * Delete config destined for an adapter
     *
     * @param {string|string[]} adapter
     * @param {string} key
     */
    deleteConfig(adapter: string | string[], key: string): void;
    // -------------------------------------------------
    // Provider methods
    // -------------------------------------------------
    /**
     * ### Add provider
     *
     * Add a single provider to be run when the server starts
     *
     * @param {ProviderInterface} provider provider class (not instance)
     */
    addProvider(provider: ProviderInterface): void;
    addProvider(adapter: string | string[], provider: ProviderInterface): void;
    /**
     * ### Add providers
     *
     * Add multiple providers to be run when the server starts
     *
     * @param {ProviderInterface} provider provider class (not instance)
     */
    addProviders(providers: ProviderInterface[]): void;
    addProviders(adapter: string | string[], providers: ProviderInterface[]): void;
    /**
     * ### Clear providers
     *
     * Remove all providers
     */
    clearProviders(): void;
    clearProviders(adapter: string | string[]): void;
    // -------------------------------------------------
    // Middleware methods
    // -------------------------------------------------
    /**
     * ### Add middleware
     *
     * Add a single scoped middleware to run for certain routes. They are identified by their id.
     *
     * @param {string} id
     * @param {MiddlewareType} middleware
     */
    addMiddleware(id: string, middleware: MiddlewareType): void;
    addMiddleware(adapter: string | string[], id: string, middleware: MiddlewareType): void;
    /**
     * ### Add multiple middlewares
     *
     * Add a list scoped middleware to run for certain routes. They are identified by their id.
     *
     * @param {Record<string, MiddlewareType>} middlewares
     */
    addMiddlewares(middlewares: Record<string, MiddlewareType>): void;
    addMiddlewares(adapter: string | string[], middlewares: Record<string, MiddlewareType>): void;
    /**
     * ### Clear middlewares
     *
     * Clear all middlewares added to the server instance
     */
    clearMiddlewares(id?: string | string[]): void;
    clearMiddlewares(adapter: string | string[], id?: string | string[]): void;
    // -------------------------------------------------
    // Global methods
    // -------------------------------------------------
    /**
     * ### Add global
     *
     * Add a single global middleware to run for all routes.
     *
     * @param {string} id
     * @param {MiddlewareType} middleware
     */
    addGlobal(cb: MiddlewareType): void;
    addGlobal(adapter: string | string[], cb: MiddlewareType): void;
    /**
     * ### Add globals
     *
     * Add a list of global middlewares to run for all routes.
     *
     * @param {string} id
     * @param {MiddlewareType} middleware
     */
    addGlobals(middlewares: MiddlewareType[]): void;
    addGlobals(adapter: string | string[], middlewares: MiddlewareType[]): void;
    /**
     * ### Clear globals
     *
     * Clear all global middlewares added to the server instance
     */
    clearGlobals(): void;
    clearGlobals(adapter: string | string[]): void;
    // -------------------------------------------------
    // Adapter methods
    // -------------------------------------------------
    /**
     * ### Inject adapter
     *
     * Inject an adapter from the vanilla Açaí Server Official Adapters. **Adapters are not shared across server instances!**
     *
     * @param {string} name Identifier of the adapter to be removed
     */
    injectAdapter(name: string | string[]): void;
    /**
     * ### Add adapter
     *
     * An adapter is an internal server that will be controlled by this instance, where it will handle all configs
     * and requests and parse everything for you.
     *
     * @param {string} name Name of the adapter to be referenced later on
     * @param {AdapterInterface} adapter
     */
    addAdapter(name: string, adapter: AdapterInterface, config?: Partial<ServerConfigInterface>): void;
    /**
     * ### Get adapter
     *
     * Get an adapter from the current server instance **Adapters are not shared across server instances!**
     *
     * @param {string} name Identifier of the adapter to be removed
     */
    getAdapter(name: string): SerializedAdapterInterface | undefined;
    /**
     * ### Remove adapter
     *
     * Remove a pre-existing adapter inside of this server instance. **Adapters are not shared across server instances!**
     *
     * @param {string} name Identifier of the adapter to be removed
     */
    removeAdapter(name: string | string[]): void;
    // -------------------------------------------------
    // Main methods
    // -------------------------------------------------
    /**
     * ### Run
     *
     * Actually start the server instance
     */
    run(): Promise<void>;
    run(adapters: string[]): Promise<void>;
    /**
     * ### Stop
     *
     * Turn off server instance to accept requests
     */
    stop(): Promise<void>;
    stop(adapters: string[]): Promise<void>;
}
type ClassType<Instance extends Record<string, any>> = {
    new (): Instance;
};
/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/
export type { ServerRequest, CustomExceptionInterface, ProviderInterface, ResponseInterface, ServerConfigInterface, ServerInterface, AdapterInterface, SerializedAdapterInterface, ClassType, MiddlewareClassType, MiddlewareCbType, MiddlewareType };
