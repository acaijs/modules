// Packages
import formidable from "formidable"
import * as path from "path"
import * as fs from "fs"
import { MiddlewareInterface } from "@acai/interfaces"

// Interfaces
import BodyParseConfig from "../interfaces/bodyParserConfig"

// Utils
import FileHandler from "../utils/FileHandler"

export default function buildBodyParserMiddleware (config?: Partial<BodyParseConfig>) {
	const BodyParserMiddleware: MiddlewareInterface = async (r, n) => {
		return n(await new Promise(resolve => {
			const uploadpath = path.join(process.cwd(), config?.uploadDir || "storage/tmp")

			// make sure dir is created
			fs.mkdirSync(uploadpath, { recursive: true })

			formidable({
				...(config?.file || {}),
				uploadDir: uploadpath,
				keepExtensions: true,
				multiples: true,
			})
				.parse(r.raw, (_, fields, prefiles) => {
				// wrap files in helper class
					const files = {}

					Object.keys(prefiles).forEach(key => {
						files[key] = new FileHandler(prefiles[key], config)
					})

					resolve({
						...r,
						fields,
						files,
					})
				})
		}))
	}

	return BodyParserMiddleware
}