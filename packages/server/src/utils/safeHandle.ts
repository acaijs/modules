// Packages
import { exceptionLog } from "@acai/utils"

// Interfaces
import { CustomExceptionInterface }	from "@acai/interfaces"

// Modules
import AdapterHandler from "../classes/AdapterHandler"

function usePreserve (value: CustomExceptionInterface["preserve"] | undefined, originalRequest: any, flowRequest: any, globalRequest: any) {
	switch (value) {
		default:
		case "all":
			return flowRequest
		case "global":
			return globalRequest
		case "none":
			return originalRequest
	}
}

export default async function safeHandle <Request = any>(callback: (... args: any[]) => any | Promise<any>, handler: AdapterHandler, request?: Request, globalRequest?: Request) {
	try {
		const response = await callback()
		return response
	}
	catch (e) {
		const error = e as CustomExceptionInterface
		const useRequest = usePreserve(error.preserve, request, error.request, globalRequest)
		delete error.request

		// check if provider is going to handle errors
		const response = await handler.onException(e as any, useRequest)

		// if providers don't handle error, fallback to default handling
		if (response === undefined) {
			// print to console
			if (error.shouldReport !== false && process.env.testing !== "true") {
				if (error.report) error.report({ error, server: handler.adapter, request: useRequest })
				else exceptionLog(error.message, error.stack?.split("\n"), error.data)
			}
		}

		// critical errors should force adapter to shutdown
		if (error.critical) {
			await handler.shutdown()
			process.exit(1)
		}

		// providers handled response to user
		if (response !== undefined) return response

		// response from the error
		if (error.render) return [error.render({ error, server: handler.adapter, request: useRequest}), useRequest, error]

		// response from message
		return [error.message || "", useRequest, error]
	}
}
