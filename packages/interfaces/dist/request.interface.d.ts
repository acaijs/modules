/// <reference types="node" />
import * as Cookies from "cookies";
import { IncomingMessage } from "http";
import { ServerRequest } from "./vanilla.request.interface";
export default interface RequestInterface {
    headers: IncomingMessage["headers"];
    params: Record<string, string | string[]>;
    query: Record<string, string | number | boolean>;
    route: string;
    options: Record<string, number | string | string[] | Record<string, string> | undefined>;
    fields: Record<string, unknown>;
    files: Record<string, any>;
    cookies: Cookies;
    httpMethod: "GET" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "DELETE" | "ANY";
    controller: string | ((...args: any[]) => any);
    method?: string;
    raw: ServerRequest["req"];
}
