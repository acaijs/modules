// Packages
import * as fs from "fs"
import * as path from "path"

// Classes
import { CustomException } from "@acai/utils"

// Exceptions
import ControllerNotFoundException from "../exceptions/controllerNotFound"

// -------------------------------------------------
// Helper methods
// -------------------------------------------------

const exists = (path: string) => fs.promises.access(path).then(() => true).catch(() => false)

async function findFile (filepath: string): Promise<string | undefined> {
	const [ name, ...dirpath ] = filepath.split(/(\/|\\)/).reverse()
	const dir = path.join(...dirpath.reverse())

	if (!(await exists(dir))) return

	const files = await fs.promises.readdir(dir, { withFileTypes: true })

	for (let i = 0; i < files.length; i++) {
		if (files[i].isFile() && files[i].name.match(new RegExp(`^${name}`)))
			return path.join(dir, files[i].name)
	}

	return undefined
}

// -------------------------------------------------
// Main method
// -------------------------------------------------

export default async function findController(controllerPath: string | ((req: any) => any), route: string) {
	// controller itself is the callback
	if (typeof controllerPath !== "string") {
		return controllerPath
	}

	const [controller, method] = controllerPath.split("@")
	const pathString = await findFile(path.join(process.cwd(), controller)) || controller
	const sanitizedControllerPath = pathString.split(/(\\|\/)/).reverse()[0].split("@")[0]

	// controller requested doesn't exist
	if (!pathString || !(await exists(pathString))) {
		throw new ControllerNotFoundException(sanitizedControllerPath, route)
	}

	const file = (await import(pathString)).default

	// check if controller is a valid object
	if (typeof file === "object" && !method) {
		throw new CustomException("controller", `Controller (${controller}) is a object but a method was not passed`)
	}
	// check if controller is a valid object
	if (typeof file === "object" && method && !file[method]) {
		throw new CustomException("controller", `Controller (${controller}) did not provide a property for the method ${method}`)
	}
	// check if controller is a valid class
	else if (typeof file === "function" && Object.getOwnPropertyNames(file.prototype).length > 1 && !method) {
		throw new CustomException("controller", `Controller (${controller}) is a class but you are trying to access it as a function`)
	}
	// check if controller is a valid class
	else if (typeof file === "function" && Object.getOwnPropertyNames(file.prototype).length > 1 && method && !file.prototype[method]) {
		throw new CustomException("controller", `Controller (${controller}) did not provide a property for the method ${method} or it was an arrow function (sadly we do not support them)`)
	}
	// check if controller is a valid callback
	else if (typeof file === "function" && method && Object.getOwnPropertyNames(file.prototype).length === 1) {
		throw new CustomException("controller", `Controller (${controller}) is a callback but you are trying to access it as a class`)
	}

	return async (request) => {
		// controller is a class or a function
		if (file.prototype?.constructor && typeof file.prototype?.constructor === "function") {
			if (Object.getOwnPropertyNames(file.prototype).length > 1) {
				const instance = new file(request)
				return instance[method].bind(instance)(request)
			}

			return file(request)
		}

		// controller should be an object
		if (method) return file[method].bind(file)(request)

		return file
	}
}