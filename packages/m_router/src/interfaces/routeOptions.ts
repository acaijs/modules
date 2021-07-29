export default interface RouteOptionsInterface {
	/**
	 * Prefix path with given value
	 */
	prefix?: string;

	/**
	 * Sufix path with given value
	 */
	sufix?: string;

	/**
	 * Prefix file path with given value
	 */
	filePrefix?: string;

	/**
	 * Sufix file path with given value
	 */
	fileSufix?: string;

	/**
	 * Should the path match exactly
	 */
	exact?: boolean;

	/**
	 * Extra options available
	 */
	options: Record<string, any>;

	/**
	 * Generic options that can be added
	 */
	[key: string]: unknown;
}
