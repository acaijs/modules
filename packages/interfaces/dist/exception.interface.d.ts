/// <reference types="node" />
import { IncomingMessage } from "http";
declare type request = {
    headers: IncomingMessage["headers"];
    params: Record<string, string | string[]>;
    query: Record<string, string | number | boolean>;
    route: string;
    options: Record<string, number | string | string[] | Record<string, string> | undefined>;
    fields?: Record<string, unknown>;
    files?: unknown;
};
export default interface CustomExceptionInterface {
    shouldReport?: boolean;
    shouldSerialize?: boolean;
    status?: number;
    critical?: boolean;
    report?(info: request): void;
    render?(info: request): unknown;
}
export {};
