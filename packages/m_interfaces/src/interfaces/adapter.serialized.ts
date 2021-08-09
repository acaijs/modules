// Interfaces
import MiddlewareInterface from "./middleware"
import ProviderInterface from "./provider"
import AdapterInterface from "./adapter"
import ServerConfigInterface from "./server.config"

export default interface SerializedAdapterInterface {
	name: string;
	adapter: AdapterInterface;
	config: ServerConfigInterface;

	providers: ProviderInterface[];
	middlewares: Record<string, MiddlewareInterface>;
	globals: MiddlewareInterface[];
}