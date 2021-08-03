// Interfaces
import { ServerInterface } 			from "@acai/interfaces"
import { RequestInterface } 		from "@acai/interfaces"
import { CustomExceptionInterface }	from "@acai/interfaces"

// Utils
import logError 		from "./log"

// Modules
import response			from "../modules/response"
import CustomException	from "../modules/CustomException"

// -------------------------------------------------
// Helper methods
// -------------------------------------------------

export const getStackTrace = (index = 4, error?: Error) => {
	let stack

	if (error) {
		stack = error.stack
	}
	else {
		try {
			throw new Error("")
		}
		catch (error) {
			stack = error.stack || ""
		}
	}

	stack = stack.split("\n").map(function (line: string) { return line.trim() })
	return stack[index]
}

export const handleException = (e: CustomExceptionInterface, request: RequestInterface, context?: [string, string?][]) => {
	if (e.shouldReport === undefined || e.shouldReport === true) {
		if (e.report) {
			e.report(request)
		}
		else {
			if (context) context.forEach(i => logError(i[0], i[1]))
		}
	}

	if (e.render) {
		return e.render(request)
	}
	else {
		if (request.headers.accept === "application/json") {
			return response({
				status: e.status || 500,
				data: {error: "Internal Server Error"},
			})
		}
		else {
			return response({
				status: e.status || 500,
				data: "<h1>500 - Internal Server Error</h1>",
			})
		}
	}
}

// -------------------------------------------------
// Main exports
// -------------------------------------------------

export async function onErrorProvider (server: ServerInterface, request: RequestInterface, error: CustomException) {
	return onErrorGeneral("Exception thrown when running provider", server, request, error)
}

export async function onErrorMiddleware (server: ServerInterface, request: RequestInterface, error: CustomException) {
	return onErrorGeneral("Exception thrown when running middleware", server, request, error)
}

export async function onErrorController (server: ServerInterface, request: RequestInterface, error: CustomException & {type:string}) {
	return onErrorGeneral("Exception thrown when running controller", server, request, error)
}

export async function onErrorGeneral (type: string, server: ServerInterface, request: RequestInterface, error: CustomException & {type: string}) {
	const providers = server.getProviders()

	for (let i = 0; i < providers.length; i++) {
		const provider = providers[i]

		if (provider.onError) {
			const response = await provider.onError({error, request, server})

			if (response) {
				return response
			}
		}
	}

	const errDescription = `Exception: ${error.message}`
	const logs = [] as [string, string?][]

	logs.push([type, `Exception: ${error.message}\n${error.stack}`])

	if (error.type && error.type === "route")
		logs.push(["Exception thrown when trying to fetch a controller", errDescription])

	return handleException(error, request, logs)
}