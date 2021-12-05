// Interfaces
import { CustomException } from "@acai/utils"

export default class QueryException extends CustomException {
	// main error properties
	public shouldReport		= true
	public shouldSerialize	= true
	public status			= 500
	public critical			= false

	// custom error properties
	public readonly query: string
	public readonly state: string

	public constructor (message: string, state: string, query: string) {
		super("query", message, {state, query})

		this.query = query
		this.state = state
	}
}