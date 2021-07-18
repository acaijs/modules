import TestInterface, { TestArgumentInterface } from "../interfaces/testQueue";
export declare const get: (tag: string[], filter?: boolean) => TestInterface[];
export declare const append: (test: Partial<TestInterface>) => void;
export declare const add: (pretest: TestArgumentInterface) => void;
