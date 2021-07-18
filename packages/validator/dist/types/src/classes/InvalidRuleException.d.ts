import { CustomException } from "@acai/server";
export default class InvalidRuleException extends CustomException {
    shouldReport: boolean;
    constructor(message: string, data?: any);
    report(): void;
}
