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