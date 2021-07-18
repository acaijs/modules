import StubConfigInterface from "../interfaces/stubConfig";
import parseArgs from "../utils/parseArgs";
export default class Stubber {
    protected callArgs: ReturnType<typeof parseArgs>;
    protected stubConfig: StubConfigInterface;
    protected stubFileContent: string[];
    protected stubOriginPath: string;
    constructor(args: string[], stubFilesPath?: string, overwriteTargetPath?: string);
    copy(): void;
    inject(extraVariables?: Record<string, string>): void;
}
