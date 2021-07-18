export default interface StubConfigInterface {
    name: string;
    description?: string;
    targetPath: string;
    variables?: Record<string, string>;
    /** path relative to the root of the stub */
    renameToNameFiles?: string[];
}
