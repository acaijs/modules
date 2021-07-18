// Packages
import * as path 				from "path";
import * as fs 					from "fs";

// Interfaces
import { RequestInterface } 	from "@acai/interfaces";
import { ResponseInterface } 	from "@acai/interfaces";
import ResponseUtilityOptions 	from "../interfaces/responseUtility";
import { ServerRequest }		from "../interfaces/serverRequest";

export default async function smartResponse (payload: string | RequestInterface | ResponseInterface | Record<string, unknown> | (() => ResponseUtilityOptions), request: ServerRequest, viewPrefix?: string) {
	const headers = {} as Record<string, any>;
	let body 	= "" as string | Record<string, unknown>;
	let status 	= 200;

	// prepare headers
	Object.keys(request.req.headers).forEach((k) => {
		if (k !== "content-length") headers[k] = request.req.headers[k]; 
	});

	// prepare content
	if (typeof payload === "function" && (payload as unknown as {name: string}).name === "responseUtility") {
		const data 	= payload();
		status 		= data.status || 200;
		body		= (data.data as string) || "";

		// bind headers
		if (data.headers) {
			Object.keys(data.headers).forEach(key => {
				headers[key] = data.headers[key]; 
			});
		}

		// import view file
		if (data.view) {
			body = fs.readFileSync(path.join(`${process.cwd()}`, viewPrefix || "", data.view), {
				encoding: "utf-8"
			});
		}
	}
	else {
		body = payload as string | Record<string, unknown>;
	}

	if (typeof body === "object") {
		headers["Accept"]		= "application/json";
		headers["Content-Type"] = "application/json";

		if (body.toObject && typeof body.toObject === "function") {
			body = body.toObject();
		}
	}
	else {
		headers["Accept"]		= "text/plain";
		headers["Content-Type"] = "text/plain";
	}

	// respond
	return {body: typeof body === "object" ? JSON.stringify(body) : body, headers, status };
}