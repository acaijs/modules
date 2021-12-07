// Packages
import Validator from "@acai/validator"

export default class HeyHo2 extends Validator {
	protected getSchema () {
		return {
			label	: [ "required", "string" ],
		}
	}
}