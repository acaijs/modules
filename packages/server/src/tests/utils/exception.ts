// Modules
import { CustomException } from "@acai/utils"

export default class Exception extends CustomException {
	public status = 200
	public shouldReport = false

	public constructor (message: string) {
		super("test", message)
	}

	public render () {
		return this.message
	}
}