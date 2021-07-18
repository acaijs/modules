export default interface ContextInterface {
    group: string[];
    tags: string[];
    timeout?: number;
    beforeAll: (() => Promise<void> | void)[];
    beforeEach: (() => Promise<void> | void)[];
    afterAll: (() => Promise<void> | void)[];
    afterEach: (() => Promise<void> | void)[];
}
