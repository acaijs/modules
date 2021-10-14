// Packages
import * as fs from "fs";

// Interfaces
import { RequestInterface } from "@acai/interfaces";

// Utils
import findFile from "./file";

export default async function findController(controller: string | ((req: RequestInterface) => any), method: string | undefined, request: RequestInterface) {
	if (typeof controller !== "string") {
		return controller;
	}
	/**
	 * This here is a performance concern
	 * This should all be loaded when the server is initialized
	 * i/o reads/writes are very expensive and will definitely have significant latency
	 * Especially since this is being called on every single request.
	 * 
	 * In addition, all file operations are synchronous
	 * 	- If two requests come in at the same time, then the i/o read operations will block the entire
	 * thread (since Node is single-threaded).
	 * 	- In production, the routing itself will be a big bottleneck in speed which should never be the case 
	 */
	const pathString = findFile(controller) || controller;

	if (!fs.existsSync(pathString)) {
		const e = new Error(`Controller ${pathString.split(/(\\|\/)/).reverse()[0].split("@")[0]} for route ${request.route} not found`) as Error & {type: string};
		e.type = "route";
		throw e;
	}

	const file = (await import(pathString)).default;

	if (file.prototype?.constructor && typeof file.prototype?.constructor === "function") {
		const instance = new file(request);

		if (method) {
			if (instance[method])
				return instance[method].bind(instance);
			else {
				const e = new Error(`Controller ${pathString.split(/(\\|\/)/).reverse()[0].split("@")[0]} for route ${request.route} does not contain method ${method}`) as Error & {type: string};
				e.type = "route";
				throw e;
			}
		}

		return instance;
	}
	else if (method) {
		return file[method];
	}
	else {
		return file;
	}
}
