import { RequestInterface } from "@acai/interfaces";
import { ResponseInterface } from "@acai/interfaces";
import ResponseUtilityOptions from "../interfaces/responseUtility";
import { ServerRequest } from "../interfaces/serverRequest";
export default function smartResponse(payload: string | RequestInterface | ResponseInterface | Record<string, unknown> | (() => ResponseUtilityOptions), request: ServerRequest, viewPrefix?: string): Promise<{
    body: string;
    headers: Record<string, any>;
    status: number;
}>;
