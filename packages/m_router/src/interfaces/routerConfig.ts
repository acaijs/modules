export default interface RouterConfigInterface {
	/**
	 * ### Variable enclose
	 *
	 * Customize how you should find and match variables present inside of the router.
	 */
	variableEnclose?: [string, string];

	/**
	 * ### Options method match
	 *
	 * Allow the match of options method in any route method
	 */
	allowOptionsMatch?: boolean;
}