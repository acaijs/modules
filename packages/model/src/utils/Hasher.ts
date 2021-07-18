// Packages
import * as bcrypt from "bcrypt";

export default class Hasher {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected value				: string;
	protected saltOrRounds		: string | number | undefined;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	constructor (value?: string, saltOrRounds?: string) {
		if (value) this.value 	= value;
		this.saltOrRounds 		= saltOrRounds;
	}

	// -------------------------------------------------
	// Instance methods
	// -------------------------------------------------

	public hash (value: string) {
		this.value = bcrypt.hashSync(value, this.saltOrRounds || 10);
	}

	public toString () {
		return this.value;
	}

	public compare (valueToCompare: string) {
		return bcrypt.compareSync(valueToCompare, this.value);
	}
}