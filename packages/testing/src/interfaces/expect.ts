export default interface ExpectInterface {
	/**
	 * ### To be
	 * 
	 * Test base assertion value to be exactly as this argument, objects are strictly compared.
	 * 
	 * @param {any} toTest Test base value against this argument
	 */
	toBe 			(toTest: unknown): ExpectInterface;
	
	/**
	 * ### To not be
	 * 
	 * Test base assertion value to not be as this argument, objects are strictly compared.
	 * 
	 * @param {any} toTest Test base value against this argument.
	 */
	toNotBe 		(toTest: unknown): ExpectInterface;
	
	/**
	 * ### To be type of
	 * 
	 * Test base assertion type to be as this argument.
	 * 
	 * @param {typeof} toTest Test base value against this argument.
	 */
	toBeTypeOf 		(toTest: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"): ExpectInterface;
	
	/**
	 * ### To be defined
	 * 
	 * Test base assertion to be defined.
	 */
	toBeDefined 	(): ExpectInterface;
	
	/**
	 * ### To be undefined
	 * 
	 * Test base assertion to be undefined.
	 */
	toBeUndefined 	(): ExpectInterface;
	
	/**
	 * ### To be null
	 * 
	 * Test base assertion to be null.
	 */
	toBeNull 		(): ExpectInterface;
	
	/**
	 * ### To not be null
	 * 
	 * Test base assertion to not be null.
	 */
	toNotBeNull 	(): ExpectInterface;
	
	/**
	 * ### To throw
	 * 
	 * Assertion value should be a callable variable.
	 */
	toThrow 	(): ExpectInterface;
	
	/**
	 * ### Cache
	 * 
	 * Will not assert, only serves as a debug.
	 */
	cache 	(title?:string): ExpectInterface;
	
	/**
	 * ### toContain
	 * 
	 * This will act differently depending on what it receives:
	 * - object: will check if contain array of keys
	 * - array: will check if it contain values
	 * - string: will check if it contains text
	 */
	toContain 	(compare: string | string[]): ExpectInterface;
}

/**
 * ### Assert
 * 
 * Provide a value to be asserted against a list of assertions, you can also concatenate those assertions
 * to be able to test many aspects of a variable at the same time.
 * 
 * @param {any} value Value to be asserted against
 */
export type ExpectAssertionInterface = (baseAssertion: unknown) => ExpectInterface;