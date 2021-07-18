import TestInterface from "../interfaces/testQueue";
import ExpectInterface from "../interfaces/expect";
declare const buildTestAssertion: (test: TestInterface) => (valueToAssert: unknown) => ExpectInterface;
export default buildTestAssertion;
