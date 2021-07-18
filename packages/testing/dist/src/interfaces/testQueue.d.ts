import ExpectInterface, { ExpectAssertionInterface } from "./expect";
export default interface TestInterface {
    callback: (expect: ExpectAssertionInterface) => Promise<void> | void;
    id: string;
    title: string;
    group: string[];
    tags: string[];
    timeout?: number;
    messages: [any, string?][];
    assertions: {
        type: (keyof ExpectInterface) | "test" | "beforeAll" | "beforeEach" | "afterAll" | "afterEach" | "timeout";
        message?: string;
        fail: boolean;
        stack?: string;
        name?: string;
    }[];
    only: boolean;
    except: boolean;
    beforeAll: (() => Promise<void> | void)[];
    beforeEach: (() => Promise<void> | void)[];
    afterAll: (() => Promise<void> | void)[];
    afterEach: (() => Promise<void> | void)[];
}
export interface TestArgumentInterface {
    callback: (expect: ExpectAssertionInterface) => Promise<void> | void;
    id: string;
    title: string;
    group: string[];
    tags: string[];
    timeout?: number;
    messages?: [any, string?][];
    assertions?: {
        type: (keyof ExpectInterface) | "test" | "beforeAll" | "beforeEach" | "afterAll" | "afterEach";
        message?: string;
        fail: boolean;
        stack?: string;
        name?: string;
    }[];
    only?: boolean;
    except?: boolean;
    beforeAll: (() => Promise<void> | void)[];
    beforeEach: (() => Promise<void> | void)[];
    afterAll: (() => Promise<void> | void)[];
    afterEach: (() => Promise<void> | void)[];
}
