// Interfaces
import ContextErrorInterface 		from "./contextError";
import { ExpectAssertionInterface } from "./expect";
import ExtraOptionsInterface 		from "./extraOptions";
import GroupAuxiliaryInterface 		from "./groupAuxiliary";
import RunSettings 					from "./runSettings";
import TestInterface 				from "./testQueue";

export default interface TestModuleInterface {
	/**
	 * ### Test
	 * 
	 * The basic way of running a test.
	 * 
	 * @param {string} title The title that will describe what this test does.
	 * @param {Function} callback The callback that will be run when the test must be verified.
	 */
	(title: string, callback: (expect: ExpectAssertionInterface) => void): ExtraOptionsInterface;

	/**
	 * ### Cache
	 * 
	 * Adds a variable that will be stored to be displayed after the tests finish
	 * 
	 * @param {any|string} arg1 Will be considered a title if the second argument is passed
	 * @param {any?} arg2 Optional argument, to be used as value to be displayed if the first one is a title
	 */
	cache: <SA = any, FA = SA extends undefined ? string : any> (arg1: FA, arg2?: SA) => void;

	/**
	 * ### Group
	 * 
	 * Group a cluster of tests under the same group, used for organization purposes.
	 * 
	 * @param {string} title The title that will describe what this group of tests are.
	 * @param {Function} callback The callback that will collect the tests inside of it.
	 */
	group: (title: string, callback: (group: GroupAuxiliaryInterface) => void) => Omit<ExtraOptionsInterface, "timeout">;

	/**
	 * ### Test only
	 * 
	 * Filter the tests to only run those that contain the only flag. **All of only will be run, not only the first one**.
	 * 
	 * @param {string} title The title that will describe what this test does.
	 * @param {Function} callback The callback that will be run when the test must be verified.
	 */
	only: (title: string, callback: (expect: ExpectAssertionInterface) => void) => ExtraOptionsInterface;

	/**
	 * ### Test except
	 * 
	 * Filter the tests to skip run those that contain the except flag. **All of except will be skipped, not only the first one**.
	 * 
	 * @param {string} title The title that will describe what this test does.
	 * @param {Function} callback The callback that will be run when the test must be verified.
	 */
	except: (title: string, callback: (expect: ExpectAssertionInterface) => void) => ExtraOptionsInterface;

	/**
	 * ### Test group tag
	 * 
	 * Group a cluster of tests under the same group and a common set of tags, used for organization and filter purposes.
	 * The tags are always joined with the ones already in  the context.
	 * 
	 * @param {string | string[]} tags Tags to be grouped with the context.
	 * @param {Function} callback The callback that will be run when the test must be verified.
	 */
	tag: (tag: string | string[], callback: () => void) => void;
	
	/**
	 * ### Find tests
	 * 
	 * Will run through your project, within the `process.cwd()` context, files that match the regex to load the tests.
	 * 
	 * @param {string} regex regex convertable string
	 */
	find: (reg?: string) => void;

	/**
	 * ### Run stored tests
	 * 
	 * Get all tests loaded manually or automatically (with find method) and run them.
	 * You can pass arguments to filter tests, or change some behaviours.
	 * 
	 * @param {string[]} tags Filter tests by tag.
	 * @param {boolean?} forceAll Force all tests to be run.
	 */
	run: (settings?: RunSettings) => void;

	/**
	 * ### Print tests on console
	 * 
	 * **This will not run the tests, only display them**
	 * 
	 * @param {TestInterface[]} tests All the tests to be displayed.
	 * @param {ContextErrorInterface[]?} contextErrors Errors to be displayed based on the context (not the test).
	 * @param {[number, number]?} elapsedTime Elapsed time based on the `process.hrtime` method response.
	 */
	print: (tests: TestInterface[], contextErrors?: ContextErrorInterface[], elapsedTime?: [number, number]) => void;

	/**
	 * ### Run stored tests and display them on console
	 * 
	 * Get all tests loaded manually or automatically (with find method) and run them.
	 * You can pass arguments to filter tests, or change some behaviours. And after that,
	 * they will be printed into the console.
	 * 
	 * @param {string[]} tags Filter tests by tag.
	 * @param {boolean?} forceAll Force all tests to be run.
	 */
	runAndPrint: (settings?: RunSettings) => void;
}