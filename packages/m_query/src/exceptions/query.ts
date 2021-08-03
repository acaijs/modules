// Interfaces
import { CustomExceptionInterface } from "@acai/interfaces"

export default class QueryException extends Error implements CustomExceptionInterface {
	// main error properties
    public shouldReport		= true;
    public shouldSerialize	= true;
    public status			= 500;
    public critical			= false;

	// custom error properties
	public readonly query: string;
	public readonly state: string;

	public constructor (message: string, state: string, query: string) {
		super(message)

		this.query = query
		this.state = state
	}
}