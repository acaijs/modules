import { ServerInterface } from "@acai/interfaces";
import { RequestInterface } from "@acai/interfaces";
import { CustomExceptionInterface } from "@acai/interfaces";
import CustomException from "../modules/CustomException";
export declare const getStackTrace: (index?: number, error?: Error | undefined) => any;
export declare const handleException: (e: CustomExceptionInterface, request: RequestInterface, context?: [string, (string | undefined)?][] | undefined) => unknown;
export declare function onErrorProvider(server: ServerInterface, request: RequestInterface, error: CustomException): Promise<unknown>;
export declare function onErrorMiddleware(server: ServerInterface, request: RequestInterface, error: CustomException): Promise<unknown>;
export declare function onErrorController(server: ServerInterface, request: RequestInterface, error: CustomException & {
    type: string;
}): Promise<unknown>;
export declare function onErrorGeneral(type: string, server: ServerInterface, request: RequestInterface, error: CustomException & {
    type: string;
}): Promise<unknown>;
