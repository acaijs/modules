// Packages
import { CustomException } from "@acai/utils"

export default class RouteNotFound extends CustomException {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// Custom settings
	public route: string
	public method: string

	// Base class override
	public status = 403
	public critical = false
	public shouldReport = false
	public shouldSerialize = false

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (route: string, method: string) {
		super("adapter.route", `Route ${method}:"${route}" not found`)
		this.route = route
		this.method = method
	}
}