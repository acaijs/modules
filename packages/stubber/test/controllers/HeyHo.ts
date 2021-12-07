// Packages
import Validator from "@acai/validator"

export default class HeyHo extends Validator {
	protected getSchema () {
		return {
			label	: [ "required", "string" ],
		}
	}
}