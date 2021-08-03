// Packages
import { CustomException } from "@acai/server"

export default class InvalidRuleException extends CustomException {
	shouldReport = true;

	public constructor (message: string, data?: any) {
		super("invalidValidationRule", message, data)
	}

	public report () {
		console.log(this.message)
	}
}