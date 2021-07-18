/// <reference types="node" />
import { ServerResponse } from "http";
import { ResponseInterface } from "@acai/interfaces";
export default function respond(res: ServerResponse, { body, headers, status }: ResponseInterface): void;
