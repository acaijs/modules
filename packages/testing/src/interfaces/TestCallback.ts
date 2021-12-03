import Assertion from "../utils/Assertion"

type TestCallback = (assertion: ReturnType<typeof Assertion>) => Promise<any> | any;
export default TestCallback