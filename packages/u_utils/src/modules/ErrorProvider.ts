// Packages
import { ProviderInterface, CustomExceptionInterface, SerializedAdapterInterface } from "@acai/interfaces"

// Modules
import response from "../modules/response"

// Utils
import isApi			from "../utils/isApi"
import isDevelopment	from "../utils/isDevelopment"
import logError			from "../utils/logError"
import storeLog 		from "../utils/storeLog"

export default class ErrorProvider {
	// -------------------------------------------------
	// Main properties
	// -------------------------------------------------

	public logStorage?: string | undefined;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public onError: ProviderInterface["onError"] = async ({error, request, server}) => {
		// ignore expected errors
		if (error.type === "validation") return

		// get error type
		let data;

		[
			this.sqlError.bind(this),
		].find(i => data = i(error as any))

		// default error message
		if (!data) {
			data = this.genericError.bind(this)(error as any, request, server)
		}

		// Handle display
		if (isApi(request)) {
			return data
		}

		// Turns off server is error is critical
		if (error.critical) {
			await server.adapter.shutdown()
		}

		return response()
			.headers({ "Content-Type": "text/html" })
			.status(error.status || 500)
			.body(`
				<h1>Error thrown: ${data.message || "An error has occured"}</h1>
				<h2>Trace</h2>
				<ul>${data.trace.map(i => `<li>${i}</li>`).join("")}</ul>
				${data.data ? `<h2>Data</h2>${JSON.stringify(data.data, null, 4)}`:""}
			`)
	}

	// -------------------------------------------------
	// Error type methods
	// -------------------------------------------------

	private genericError (error: CustomExceptionInterface & {[_ in string]: any}, request: any, server: SerializedAdapterInterface) {
		// arrange data
		const data = {
			message	: error.message,
			trace	: error.stack?.split("\n").splice(1).map(i => i.trim().replace("at ", "")),
			... error.data,
		}

		// try custom exceptions report
		if (error.shouldReport !== false) {
			// custom error report
			if (error.report) {
				error.report({request, error, server})
			}
			// default error report
			else {
				logError(data.message, data.trace, data)
			}
		}

		// log error to storage if required
		if (this.logStorage && error.shouldSerialize) {
			storeLog(this.logStorage, data)
		}

		// try custom exception render
		if (error.render) {
			return error.render({error, request, server})
		}

		// default fallback render
		if (isDevelopment()) {
			return data
		}

		return {
			message	: "An internarl error has occured in the application",
		}
	}

	private sqlError (error: CustomExceptionInterface & {[_ in string]: any}) {
		if (error.sqlMessage) {
			const data = {
				query	: error.query,
				message	: error.sqlMessage,
				state	: error.sqlState,
				trace	: error.stack?.split("\n").splice(1).map(i => i.trim().replace("at ", "")),
				model 	: error.model,
			}

			// log error to storage if required
			if (this.logStorage && error.shouldSerialize !== false) {
				storeLog(this.logStorage, data)
			}

			// Log
			logError(data.message, data.trace, data)

			// Be careful what to show when in production env
			if (isDevelopment()) {
				return data
			}
			else {
				return {
					message	: "An error has occured in your database",
					model 	: data.model,
				}
			}
		}

		return undefined
	}
}