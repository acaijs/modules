import { IncomingMessage, ServerResponse } from "http"

interface ICustomIncomingMessage extends IncomingMessage {
	method	: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "ANY" | "OPTIONS";
	url		: string;
	headers	: Record<string, string>;
}
export interface ServerRequest {
	req: ICustomIncomingMessage;
	res: ServerResponse;
}
