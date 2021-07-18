import ServerConfigInterface from "./server.config.interface";
import MiddlewareType from "./middleware.interface";
import ProviderInterface from "./provider.interface";
export default interface ServerInterface {
    config: Partial<ServerConfigInterface>;
    addProvider(provider: ProviderInterface): void;
    addProviders(providers: ProviderInterface[]): void;
    getProviders(): ProviderInterface[];
    clearProviders(): void;
    addMiddleware(id: string, middleware: MiddlewareType): void;
    addMiddlewares(middlewares: Record<string, MiddlewareType>): void;
    getMiddlewares(): Record<string, MiddlewareType>;
    clearMiddlewares(id?: string | string[]): void;
    addGlobal(cb: MiddlewareType): void;
    addGlobals(middlewares: MiddlewareType[]): void;
    getGlobals(): MiddlewareType[];
    clearGlobals(id?: string | string[]): void;
    run(): Promise<void>;
}
