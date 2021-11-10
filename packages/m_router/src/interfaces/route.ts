// Interfaces
import methodTypes from "./method"

export default interface RouteInterface<T = Record<string, unknown>> {
	/**
	 * url path
	 */
	path	: string;

	/**
	 * file that should be loaded
	 */
	file	: string | ((...args: any[]) => any);

	/**
	 * HTTP Method of the route
	 */
	method	: methodTypes;

	/**
	 * Extra options
	 */
	options	: T;
}