// Modules
import CustomException from "../../modules/CustomException";

export default class Exception extends CustomException {
	public status = 200;
	public shouldReport = false;

	public constructor (message: string) {
		super("test", message);
	}

	public render () {
		return this.message;
	}
}