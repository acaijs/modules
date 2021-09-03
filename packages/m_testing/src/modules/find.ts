// Packages
import * as glob from "glob"
import { join } from "path"

const findMethod = async (regex?: string) => {
	const files = glob.sync(regex || "./**/*.{test,tests}.{ts,js}", {
		cwd		: process.cwd(),
		nodir	: true,
		ignore	: [ "./node_modules/**/*" ],
	})

	files.forEach(async file => await import(join(process.cwd(), file)))
}

export default findMethod