// Packages
import { CustomException } from "@acai/utils"

export default class MiddlewareNotFound extends CustomException {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// Custom settings
	public middleware: string
	public route: string

	// Base class override
	public critical = false
	public shouldReport = true
	public shouldSerialize = false

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (middleware: string, route: string) {
		super("server.middleware", `Middleware ${middleware} was not found for route ${route}`)
		this.middleware = middleware
		this.route = route
	}
}