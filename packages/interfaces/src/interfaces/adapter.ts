// Interfaces
import { ServerRequest } from ".."
import ServerConfigInterface from "./server.config"

export default interface AdapterInterface {
	/**
	 * ### Boot
	 *
	 * Request of the server to the adapter boot, use this to actually start the adapter, do not use constructor for that!
	 *
	 * @param config
	 */
	boot (config: Partial<ServerConfigInterface>): Promise<boolean> | boolean;

	/**
	 * ### Shutdown
	 *
	 * Shutdown adapter and remove any pending services online
	 */
	shutdown (): Promise<void> | void;

	/**
	 * ### On request
	 *
	 * This method allows you to bind a callback that you can call everytime you receive a request,
	 * booting the main server. The return of this callback will be the response to be sent by the server.
	 *
	 * @param callback Call this function when you receive a request from the server
	 */
	onRequest(
		onRequestStart: (request: ServerRequest, controller: string | ((req: ServerRequest) => any | Promise<any>), middlewares?: string[]) => any,
		safeThread: (cb: () => Promise<any>) => Promise<any>,
	): Promise<void> | void;
}
