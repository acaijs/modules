// Interfaces
import RequestInterface from "./request"
import CustomExceptionInterface	from "./exception"
import SerializedAdapterInterface from "./adapter.serialized"

export default interface ProviderInterface {
	/**
	 * Allows you to boot services (database, mailing, etc) before the server actually starts.
	 *
	 * @param {ServerInterface} server current server instance
	 */
	boot? (server: SerializedAdapterInterface): Promise<void> | void;

	/**
	 * Allows you to handle specific errors in their provider scope, for example. You could create
	 * a validator provider where you could customize validation errors.
	 *
	 * @param data
	 */
	onError? (data: {error: CustomExceptionInterface; request: RequestInterface; server: SerializedAdapterInterface}): Promise<unknown> | unknown;
}