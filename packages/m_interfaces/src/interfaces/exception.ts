// Interfaces
import { IncomingMessage } from "http"

type request = {
	headers		: IncomingMessage["headers"];
	params		: Record<string, string | string[]>;
	query		: Record<string, string | number | boolean>;
	route		: string;
	options		: Record<string, number | string | string[] | Record<string, string> | undefined>;
	fields 	   ?: Record<string, unknown>;
	files	   ?: unknown;
};

export default interface CustomExceptionInterface extends Error {
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
	 * A way to categorize your errors so you can group them into subsets that can easily be handled together. Such as: route, validation, database, etc.
	 */
	type?: string;

	/**
	 * Method that overwrites the server original error dump to the console
	 */
	report? (info: request): void;

	/**
	 * Responsible for rendering a response to the user
	 */
	render? (info: request): unknown;
}