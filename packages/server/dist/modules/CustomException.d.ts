import { CustomExceptionInterface } from "@acai/interfaces";
export default class Exception extends Error implements CustomExceptionInterface {
    _message: string;
    _data?: unknown;
    _type: string;
    status: number;
    readonly shouldReport: boolean;
    constructor(type: string, message: string, data?: unknown);
    get message(): string;
    get data(): unknown;
    get type(): string;
}
