// Packages
import Validator from "@acai/validator";

export default class {{ name }} extends Validator {
	protected getSchema () {
		return {
			label	: [ "required", "string" ],
		};
	}
}