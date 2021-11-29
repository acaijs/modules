// Interfaces
import MiddlewareInterface from "../types/middleware"
import ProviderInterface from "./provider"
import AdapterInterface from "./adapter"
import ServerConfigInterface from "./server.config"

export default interface SerializedAdapterInterface {
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