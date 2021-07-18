// Packages
import * as path	from "path";
import { router }	from "@acai/router";
import * as Cookies	from "cookies";

// Interfaces
import { RouteInterface }			from "@acai/router";
import { ServerInterface }			from "@acai/interfaces";
import { RequestInterface } 		from "@acai/interfaces";
import { ResponseInterface }		from "@acai/interfaces";
import { MiddlewareInterface }		from "@acai/interfaces";
import { ServerRequest } 			from "../interfaces/serverRequest";

// Modules
import response 					from "../modules/response";

// Utils
import smartResponse 		from "../utils/response";
import findController 		from "../utils/controller";
import * as errorHandling	from "../utils/error";
import respond 				from "../utils/respond";

export default class RequestHandler {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// ref
	private server: ServerInterface;
	private serverRequest: ServerRequest;
	private onRequest?: (path: string, method: string) => RequestInterface;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (req: ServerRequest, server: ServerInterface, onRequest?: (path: string, method: string) => RequestInterface) {
		this.serverRequest 	= req;
		this.server 		= server;
		this.onRequest 		= onRequest;
	}

	public async buildBaseRequest (routes: RouteInterface[]) {
		return await this.getProperties(this.serverRequest, routes);
	}

	public buildPipeline (request: RequestInterface, globals: MiddlewareInterface[], middlewares: Record<string, MiddlewareInterface>) {
		// run middlewares
		const middlewaresToRun 	= [...(request.options.middleware as string[] || [])].reverse();
		let curry: (request: RequestInterface) => Promise<RequestInterface | ResponseInterface | string | Record<string, unknown>>;

		if (request.httpMethod === "OPTIONS") {
			curry = async (r) => ([response().status(204).data(""), r] as unknown as Promise<RequestInterface | ResponseInterface | string | Record<string, unknown>>);
		}
		else {
			curry = async (fluxRequest: RequestInterface) => {
				const [name, method] 	= [request.controller, request.method];
				const pathString 		= typeof name === "string" ? path.join(`${process.cwd()}`, this.server.config.filePrefix || "", name):name;
	
				return findController(pathString, method, fluxRequest)
					.then(async response => {
						return [(typeof response === "function" ? (await response(fluxRequest)):response), fluxRequest];
					})
					.catch(async error => {
						return [await errorHandling.onErrorController(this.server, fluxRequest, error), fluxRequest];
					}) as Promise<RequestInterface | ResponseInterface | string | Record<string, unknown>>;
			};
		}

		// build local currying
		for (let i = 0; i < middlewaresToRun.length; i++) {
			// get info
			const name 						= middlewaresToRun[i];
			const [ middleware, options ] 	= name.split(":");
			const lastcurry 				= curry;

			curry = async (fluxRequest: RequestInterface) => {
				try {
					return await middlewares[middleware](fluxRequest, lastcurry, (options || "").split(","));
				}
				catch (e) {
					return await errorHandling.onErrorMiddleware(this.server, fluxRequest, e) as string;
				}
			};
		}

		// build global currying
		for (let i = 0; i < globals.length; i++) {
			// get info
			const middleware 	= globals[i];
			const lastcurry 	= curry;

			curry = async (request: RequestInterface) => await middleware(request, lastcurry);

			curry = async (fluxRequest: RequestInterface) => {
				try {
					return await middleware(fluxRequest, lastcurry);
				}
				catch (e) {
					return await errorHandling.onErrorMiddleware(this.server, fluxRequest, e) as string;
				}
			};
		}

		return curry;
	}

	public async proccess (request: RequestInterface, curry: (request: RequestInterface) => Promise<RequestInterface | ResponseInterface | string | Record<string, unknown>>) {
		// run currying
		const lastresponseraw	= await curry(request);
		const lastresponse		= Array.isArray(lastresponseraw) ? lastresponseraw:[lastresponseraw,request];
		const responseData		= await smartResponse(lastresponse[0], this.serverRequest, this.server.config.viewPrefix);
		respond(this.serverRequest.res, {...(lastresponse[1] || {}), ...(responseData || {}), headers: {...(lastresponse[1] || {headers:{}}).headers, ...(responseData.headers || {})}});
	}

	// -------------------------------------------------
	// Helper methods
	// -------------------------------------------------

	private async getProperties ({ req: request, res }: ServerRequest, routes: RouteInterface[]) {
		if (this.onRequest)
			return await this.onRequest(request.url, request.method);

		// parts
		const [ url, params ] = request.url?.split("?");

		// build route
		const match = router(url, request.method, routes);

		if (!match) return;

		// build query params
		const query 	= {} as Record<string, string | number | boolean>;
		
		if (params) {
			const prequery 	= (params || "").split("&").map(i => i.split("="));

			for (let i = 0; i < prequery.length; i ++) {
				const [_key, value] = prequery[i];
				const key = decodeURI(_key);
	
				if (!value) {
					query[key] = true;
				}
				else if (!value.match(/\D+/)) {
					query[key] = parseFloat(value);
				}
				else {
					query[key] = decodeURI(value);
				}
			}
		}

		// cookie encryption
		const key = this.server.config.key;

		// build request
		const response: RequestInterface = {
			headers		: request.headers,
			route		: match.path,
			controller	: typeof match.file === "string" ? match.file.split("@")[0]:match.file,
			method		: typeof match.file === "string" ? match.file.split("@")[1]:undefined,
			options 	: match.options,
			params		: match.variables,
			query		: query,
			fields		: {},
			files		: {},
			cookies		: new Cookies(request, res, key ? { keys: [key] } : undefined),
			httpMethod	: request.method,
			raw			: request,
		};

		return response;
	}
}