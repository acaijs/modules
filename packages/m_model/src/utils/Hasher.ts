// Packages
import * as bcrypt from "bcrypt"

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
		if (value) this.value 	= value
		this.saltOrRounds 		= `$2b$10$${saltOrRounds}`
	}

	// -------------------------------------------------
	// Instance methods
	// -------------------------------------------------

	public hash (value: string) {
		this.value = bcrypt.hashSync(value, this.saltOrRounds || 10)
	}

	public toString () {
		return this.value
	}

	public compare (valueToCompare: string) {
		return bcrypt.compareSync(valueToCompare, this.value)
	}

	// -------------------------------------------------
	// Helper methods
	// -------------------------------------------------

	private hashCode(str: string) {
		let hash = 0, i, chr
		if (str.length === 0) return hash
		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i)
			hash  = ((hash << 5) - hash) + chr
			hash |= 0 // Convert to 32bit integer
		}
		return hash
	}
}