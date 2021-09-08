export default interface ServerRequest<RawRequest = any> {
	/**
	 * Represents request metadata content
	 */
	headers: Record<string, string>;

	/**
	 * Resource coming from client
	 */
	body: Record<string, string> | string;

	/**
	 * Query is a immutable side effect that serves organization. Such as pagination, perpage, filters, etc
	 */
	query: Record<string, string | boolean | number>;

	/**
	 * Params are resource identifiers, used by the request to find current requested data
	 */
	params: Record<string, string>;

	/**
	 * Raw request data sent by the adapter
	 */
	raw: RawRequest;

	/**
	 * Status number that can be correlated to a manual assertion on the adapter
	 */
	status?: number;

	/**
	 * Controller information given by the adapter. This is injected automatically by Açaí, so you don't
	 * have to handle it in the adapter
	 */
	controller: string | ((app: ServerRequest) => any);
}