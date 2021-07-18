import TestInterface from "../interfaces/testQueue";
import ContextErrorInterface from "../interfaces/contextError";
export default function run(tests: TestInterface[], contextErrors?: ContextErrorInterface[], elapsedTime?: [number, number]): Promise<void>;
