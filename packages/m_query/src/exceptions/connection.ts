// Interfaces
import { CustomExceptionInterface } from "@acai/interfaces"

export default class ConnectionException extends Error implements CustomExceptionInterface {
	// main error properties
    public shouldReport		= true;
    public shouldSerialize	= true;
    public status			= 500;
    public critical			= true;
}