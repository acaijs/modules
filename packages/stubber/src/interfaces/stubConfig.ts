export default interface StubConfigInterface {
	/**
	 * Identifier to be called with the CLI
	 */
	name				: string;

	/**
	 * Optional description to be shown when --help stub
	 */
	description?		: string;

	/**
	 * Where to place the stub when spawned
	 */
	targetPath			: string;

	/**
	 * Default values for variables
	 */
	variables?			: Record<string, string>;
	
	/**
	 * path relative to the root of the stub
	 */
	renameToNameFiles?	: string[];
}