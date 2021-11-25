// Interfaces
import CustomExceptionInterface	from "./exception"
import SerializedAdapterInterface from "./adapter.serialized"
import ServerRequest from "./request"

export default interface ProviderInterface {
	/**
	 * Allows you to boot services (database, mailing, etc) before the server actually starts.
	 *
	 * @param {ServerInterface} server current server instance
	 */
	boot? (server: SerializedAdapterInterface): Promise<void> | void;

	/**
	 * Runs after the server boot method is called, you can use this to tell services you are ready to receive data
	 *
	 * @param {ServerInterface} server current server instance
	 */
	ready? (server: SerializedAdapterInterface): Promise<void> | void;

	/**
	 * Runs before server shutdowns, you can use this to dispose of any service you won't need anymore
	 *
	 * @param {ServerInterface} server current server instance
	 */
	shutdown? (server: SerializedAdapterInterface): Promise<void> | void;

	/**
	 * Allows you to handle specific errors in their provider scope, for example. You could create
	 * a validator provider where you could customize validation errors.
	 *
	 * @param data
	 */
	onError? (data: {error: CustomExceptionInterface; request: ServerRequest; server: SerializedAdapterInterface}): Promise<unknown> | unknown;
}