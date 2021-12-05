import { IncomingMessage, ServerResponse } from "http"

export interface ICustomIncomingMessage extends IncomingMessage {
	method	: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "ANY" | "OPTIONS";
	url		: string;
	headers	: Record<string, string>;
}
export default interface ServerRequest {
	req: ICustomIncomingMessage;
	res: ServerResponse;
}
