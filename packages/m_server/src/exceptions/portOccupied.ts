// Packages
import { CustomException } from "@acai/utils"

export default class PortOccupied extends CustomException {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	// Custom settings
	public port: number;

	// Base class override
	public critical = true;
	public shouldReport = true;
	public shouldSerialize = true;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public constructor (portOccupied: number) {
		super("server.port", `Port ${portOccupied} is already being used`)
		this.port = portOccupied
	}
}