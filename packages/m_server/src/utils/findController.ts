// Packages
import * as fs from "fs"
import * as path from "path"

// Exceptions
import ControllerNotFoundException from "../exceptions/controllerNotFound"

// -------------------------------------------------
// Helper methods
// -------------------------------------------------

function findFile (filepath: string): string | undefined {
	const [ name, ...dirpath ] = filepath.split(/(\/|\\)/).reverse()
	const dir = path.join(...dirpath.reverse())

	if (!fs.existsSync(dir)) return

	const files = fs.readdirSync(dir, { withFileTypes: true })

	for (let i = 0; i < files.length; i++) {
		if (files[i].isFile() && files[i].name.match(new RegExp(`^${name}`)))
			return path.join(dir, files[i].name)
	}
}

// -------------------------------------------------
// Main method
// -------------------------------------------------

export default async function findController(path: string | ((req: any) => any), request: any) {
	// controller itself is the callback
	if (typeof path !== "string") {
		return path
	}

	const [controller, method] = path
	const pathString = findFile(controller) || controller
	const controllerPath = pathString.split(/(\\|\/)/).reverse()[0].split("@")[0]

	// controller requested doesn't exist
	if (!fs.existsSync(pathString)) {
		throw new ControllerNotFoundException(controllerPath, request.route)
	}

	const file = (await import(pathString)).default

	// controller is a class or a function
	if (file.prototype?.constructor && typeof file.prototype?.constructor === "function") {
		const instance = new file(request)

		// access property in context
		if (method) {
			if (instance[method])
				return instance[method].bind(instance)
			else {
				throw new ControllerNotFoundException(controllerPath, request.route, method)
			}
		}

		return instance
	}

	// controller should be an object
	if (method) {
		if (file[method])
			return file[method]

		throw new ControllerNotFoundException(controllerPath, request.route, method)
	}

	return file
}