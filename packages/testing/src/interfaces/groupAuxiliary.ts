export default interface GroupAuxiliaryInterface {
	/**
	 * ### Before all
	 *
	 * Run once before the context.
	 */
	beforeAll	: (callback:() => void) => void;
	/**
	 * ### Before each
	 *
	 * Run everytime before a test starts in a context.
	 */
	beforeEach	: (callback:() => void) => void;
	/**
	 * ### After all
	 *
	 * Run once after the context.
	 */
	afterAll	: (callback:() => void) => void;
	/**
	 * ### After each
	 *
	 * Run everytime after a test ended in a context.
	 */
	afterEach	: (callback:() => void) => void;
}