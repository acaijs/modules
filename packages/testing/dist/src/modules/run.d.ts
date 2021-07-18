import TestInterface from "../interfaces/testQueue";
import ContextErrorInterface from "../interfaces/contextError";
import RunSettings from "../interfaces/runSettings";
export declare const getCurr: () => any;
export default function run(settings?: RunSettings): Promise<[TestInterface[], ContextErrorInterface[], [number, number]]>;
