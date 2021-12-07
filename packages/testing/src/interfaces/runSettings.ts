export default interface RunSettings {
	/**
	 * Only allow those specific tags to run.
	 */
	tags	?: string[];

	/**
	 * Force all tests to run, ignoring only, except and tags.
	 */
	forceAll?: boolean;

	/**
	 * Displays spinner while tests are running, defaults to true.
	 */
	spinner	?: boolean;

	/**
	 * Time that the test must run to not cause an timeout in milliseconds, defaults to 2000 ms.
	 */
	timeout	?: number;
}