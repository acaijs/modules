// Interfaces
import { MiddlewareInterface, ProviderInterface, AdapterInterface, ServerConfigInterface } from "@acai/interfaces"

export default interface SerializedAdapterInterface {
	name: string;
	adapter: AdapterInterface;
	config: ServerConfigInterface;

	providers: ProviderInterface[];
	middlewares: Record<string, MiddlewareInterface>;
	globals: MiddlewareInterface[];
}