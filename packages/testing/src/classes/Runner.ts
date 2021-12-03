export default class Runner {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected _context = {}
	protected rgx = "./**/*.js"
	protected files?: string[]
	protected _onLoadFile: ((fileString: string, filePath: string) => string) = () => ""

	// static
	protected static current: Runner = new Runner()

	// -------------------------------------------------
	// Static methods
	// -------------------------------------------------

	public static getCurrent () {
		return this.current
	}

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public async find (rgx: string) {
		if (rgx !== this.rgx || !this.files) {
			this.rgx = rgx
		}

		return this.files
	}

	public onLoadFile (callback: ((fileString: string, filePath: string) => string)) {
		this._onLoadFile = callback
	}

	public setDefault () {
		Runner.current = this
	}

	// -------------------------------------------------
	// Getters
	// -------------------------------------------------

	public get ctx () {
		return this._context
	}
}