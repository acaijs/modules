interface ContextErrorInterface {
    group: string[];
    fails: {
        stack: string;
        title: string;
        message: string;
        type: string;
        data: any[];
    }[];
}
interface ExpectInterface {
    /**
     * ### To be
     *
     * Test base assertion value to be exactly as this argument, objects are strictly compared.
     *
     * @param {any} toTest Test base value against this argument
     */
    toBe(toTest: unknown): ExpectInterface;
    /**
     * ### To not be
     *
     * Test base assertion value to not be as this argument, objects are strictly compared.
     *
     * @param {any} toTest Test base value against this argument.
     */
    toNotBe(toTest: unknown): ExpectInterface;
    /**
     * ### To be type of
     *
     * Test base assertion type to be as this argument.
     *
     * @param {typeof} toTest Test base value against this argument.
     */
    toBeTypeOf(toTest: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"): ExpectInterface;
    /**
     * ### To be defined
     *
     * Test base assertion to be defined.
     */
    toBeDefined(): ExpectInterface;
    /**
     * ### To be undefined
     *
     * Test base assertion to be undefined.
     */
    toBeUndefined(): ExpectInterface;
    /**
     * ### To be null
     *
     * Test base assertion to be null.
     */
    toBeNull(): ExpectInterface;
    /**
     * ### To not be null
     *
     * Test base assertion to not be null.
     */
    toNotBeNull(): ExpectInterface;
    /**
     * ### To throw error
     *
     * Assertion value should be a callable variable. Expects the error to contain the same values if an error is passed
     */
    toThrow(error?: Record<string, any>): ExpectInterface;
    /**
     * ### Cache
     *
     * Will not assert, only serves as a debug.
     */
    cache(title?: string): ExpectInterface;
    /**
     * ### toContain
     *
     * This will act differently depending on what it receives:
     * - object: will check if contain array of keys
     * - array: will check if it contain values
     * - string: will check if it contains text
     */
    toContain(compare: string | string[]): ExpectInterface;
}
/**
 * ### Assert
 *
 * Provide a value to be asserted against a list of assertions, you can also concatenate those assertions
 * to be able to test many aspects of a variable at the same time.
 *
 * @param {any} value Value to be asserted against
 */
type ExpectAssertionInterface = (baseAssertion: unknown) => ExpectInterface;
interface ExtraOptionsInterface {
    /**
     * ### Tagging
     *
     * Add a tag or group of tags into a single test
     */
    tag: (tags: string | string[]) => ExtraOptionsInterface;
    /**
     * ### Timeout
     *
     * Change your test default time out
     */
    timeout: (time: number) => ExtraOptionsInterface;
}
interface GroupAuxiliaryInterface {
    /**
     * ### Before all
     *
     * Run once before the context.
     */
    beforeAll: (callback: () => void) => void;
    /**
     * ### Before each
     *
     * Run everytime before a test starts in a context.
     */
    beforeEach: (callback: () => void) => void;
    /**
     * ### After all
     *
     * Run once after the context.
     */
    afterAll: (callback: () => void) => void;
    /**
     * ### After each
     *
     * Run everytime after a test ended in a context.
     */
    afterEach: (callback: () => void) => void;
}
interface RunSettings {
    /**
     * Only allow those specific tags to run.
     */
    tags?: string[];
    /**
     * Force all tests to run, ignoring only, except and tags.
     */
    forceAll?: boolean;
    /**
     * Displays spinner while tests are running, defaults to true.
     */
    spinner?: boolean;
    /**
     * Time that the test must run to not cause an timeout in milliseconds, defaults to 2000 ms.
     */
    timeout?: number;
}
interface TestInterface {
    callback: (expect: ExpectAssertionInterface) => Promise<void> | void;
    // identification
    id: string;
    title: string;
    group: string[];
    tags: string[];
    timeout?: number;
    // result
    fail: boolean;
    messages: [any, string?][];
    assertions: {
        type: (keyof ExpectInterface) | print"         | mport runAnd | intMethod 	fr | "./modules | unAndPrint"         | aces
        ;
        message?: string;
        fail: boolean;
        stack?: string;
        name?: string;
        data: any[];
        async?: () => Promise<void>;
    }[];
    // filter
    only: boolean;
    except: boolean;
    // callbacks
    beforeAll: (() => Promise<void> | void)[];
    beforeEach: (() => Promise<void> | void)[];
    afterAll: (() => Promise<void> | void)[];
    afterEach: (() => Promise<void> | void)[];
}
interface TestModuleInterface {
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
    cache: <SA = any, FA = SA extends undefined ? string : any>(arg1: FA, arg2?: SA) => void;
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
    print: (tests: TestInterface[], contextErrors?: ContextErrorInterface[], elapsedTime?: [
        number,
        number
    ]) => void;
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
declare const test: TestModuleInterface;
export { test as default };
