// Packages
import * as Cookies			from "cookies"
import { IncomingMessage } 	from "http"

interface ICustomIncomingMessage extends IncomingMessage {
	method	: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "ANY" | "OPTIONS";
	url		: string;
	headers	: Record<string, string>;
  }

export default interface HtppRequest {
	/** Request headers */
	headers		: IncomingMessage["headers"];
	/** Url dynamic variables */
	params		: Record<string, string | string[]>;
	/** Query parameters of the url */
	query		: Record<string, string | number | boolean>;
	/** Literal route string */
	route		: string;
	/** Options described with the route, such as middlewares */
	options		: Record<string, number | string | string[] | Record<string, string> | undefined>;
	/** Request body fields */
	fields 	   	: Record<string, unknown>;
	/** Request files, not available in get routes or non form-data content-types */
	files	   	: Record<string, any>;
	/** `Cookies` package to handle request and response cookies, see their documentation for usage */
	cookies		: Cookies;
	/** Request HTTP Method */
	httpMethod	: "GET" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "DELETE" | "ANY";
	/** Name of the controller file or callback */
	controller	: string | ((...args: any[]) => any);
	/** Method to lookup inside controller */
	method?		: string;
	/** Raw request coming from the http server */
	raw			: ICustomIncomingMessage;
}