// Interfaces
import { CustomException } from "@acai/utils"

export default class ConnectionException extends CustomException {
	// main error properties
    public shouldReport		= true;
    public shouldSerialize	= true;
    public status			= 500;
    public critical			= true;
}