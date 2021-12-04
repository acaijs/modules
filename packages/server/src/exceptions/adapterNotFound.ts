// Packages
import { CustomException } from "@acai/utils"

export default class AdapterNotFound extends CustomException {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// Custom settings
	public adapter: string;

	// Base class override
	public critical = true;
	public shouldReport = true;
	public shouldSerialize = true;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (adapterName: string) {
		super("server.adapter", `Adapter ${adapterName} was not found when initializing server`)
		this.adapter = adapterName
	}
}