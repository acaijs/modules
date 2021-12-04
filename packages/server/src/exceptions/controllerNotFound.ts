// Packages
import { CustomException } from "@acai/utils"

export default class ControllerNotFoundException extends CustomException {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// Custom settings
	public controller: string;
	public route: string;
	public method?: string;

	// Base class override
	public critical = false;
	public shouldReport = true;
	public shouldSerialize = false;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (controller: string, route: string, method?: string) {
		super("adapter.route.controller", `Method ${method} of the controller ${controller} in the route ${route} was not found`, { controller, route, method })

		if (method) this._message = `Method ${method} of the controller ${controller} in the route ${route} was not found`
		else this._message = `Controller ${controller} for route ${route} not found`

		this.controller = controller
		this.route = route
		this.method = method
	}

	public render () {
		return this.message
	}
}