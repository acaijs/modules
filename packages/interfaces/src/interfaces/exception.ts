// Interfaces
import ServerRequest from "./request"
import SerializedAdapterInterface from "./adapter.serialized"

export default interface CustomExceptionInterface<Request = ServerRequest> extends Error {
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
	report?(info: {server: SerializedAdapterInterface; error: CustomExceptionInterface; request: Request}): void;

	/**
	 * Responsible for rendering a response to the user
	 */
	render?(info: {server: SerializedAdapterInterface; error: CustomExceptionInterface; request: Request}): unknown;
}