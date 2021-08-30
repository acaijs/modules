// Packages
import { exceptionLog } from "@acai/utils"

// Interfaces
import { CustomExceptionInterface }	from "@acai/interfaces"

// Modules
import AdapterHandler from "../classes/AdapterHandler"

export default async function safeHandle (callback: (... args: any[]) => any | Promise<any>, handler: AdapterHandler) {
	try {
		const response = await callback()
		return response
	}
	catch (e) {
		const error = e as CustomExceptionInterface

		// check if provider is going to handle errors
		const response = await handler.onException(e as any)

		// if providers don't handle error, fallback to default handling
		if (response === undefined) {
			// print to console
			if (error.shouldReport !== false && process.env.testing !== "true") {
				if (error.report) error.report({ error, server: handler.adapter, request: error.request })
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
		if (error.render) return error.render({ error, server: handler.adapter, request: error.request })

		// response from message
		return error.message || ""
	}
}
