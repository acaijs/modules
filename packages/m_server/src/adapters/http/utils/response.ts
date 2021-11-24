// Packages
import * as path 				from "path"
import * as fs 					from "fs"

// Interfaces
import { ResponseInterface } from "@acai/interfaces"
import RequestInterface, { ICustomIncomingMessage } from "../../../interfaces/httpServerRequest"

// Utils
import censor from "../../../utils/censor"

export default async function smartResponse (payload: [string | RequestInterface | ResponseInterface | Record<string, unknown> | (() => any), any], request: ICustomIncomingMessage, viewPrefix?: string) {
	const headers = {} as Record<string, any>
	let body 	= "" as string | Record<string, unknown>
	let status 	= 200

	// prepare headers
	Object.keys(request.headers).forEach((k) => {
		if (k !== "content-length") headers[k] = request.headers[k]
	})

	// merge later headers
	Object.keys(payload[1].headers).forEach((k) => {
		if (k !== "content-length") headers[k] = payload[1].headers[k]
	})

	// prepare content
	if (typeof payload[0] === "function" && (payload[0] as unknown as {utility: string}).utility === "response") {
		const data 	= payload[0]()
		status 		= data.status || 200
		body		= (data.body as string) || ""

		// bind headers
		if (data.headers) {
			Object.keys(data.headers).forEach(key => {
				headers[key] = data.headers[key]
			})
		}

		// import view file
		if (data.view) {
			body = fs.readFileSync(path.join(`${process.cwd()}`, viewPrefix || "", data.view), {
				encoding: "utf-8",
			})
		}
	}
	else {
		body = payload[0] as string | Record<string, unknown>
	}

	if (typeof body === "object") {
		headers["Accept"]		= "application/json"
		headers["Content-Type"] = "application/json"

		if (body.toObject && typeof body.toObject === "function") {
			body = body.toObject()
		}
	}
	else if (!headers["Content-Type"]) {
		headers["Accept"]		= "text/plain"
		headers["Content-Type"] = "text/plain"
	}

	// respond
	return {
		body: typeof body === "object" ? censor(body) : body,
		headers,
		status,
	}
}