// Packages
import * as glob from "glob"
import { join } from "path"

const findMethod = async (regex?: string) => {
	await new Promise(r => {
		glob.glob(regex || "./**/*.{test,tests}.{ts,js}", {
			cwd		: process.cwd(),
			nodir	: true,
			ignore	: [ "./node_modules/**/*" ],
		}, (_e, matches) => {
			Promise.all(matches.map(async file => import(join(process.cwd(), file)))).then(r)
		})
	})
}

export default findMethod