// Interfaces
import ServerInterface			from "./server"
import RequestInterface			from "./request"
import CustomExceptionInterface	from "./exception"

export default interface ProviderInterface {
	/**
	 * Allows you to boot services (database, mailing, etc) before the server actually starts.
	 *
	 * @param {ServerInterface} server current server instance
	 */
	boot? (server: ServerInterface): Promise<void> | void;

	/**
	 * Allows you to handle specific errors in their provider scope, for example. You could create
	 * a validator provider where you could customize validation errors.
	 *
	 * @param data
	 */
	onError? (data: {error: CustomExceptionInterface; request: RequestInterface; server: ServerInterface}): Promise<unknown> | unknown;
}