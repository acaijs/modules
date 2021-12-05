// Packages
import formidable from "formidable"
import * as path from "path"
import * as fs from "fs"
import { MiddlewareType } from "@acai/interfaces"

// Interfaces
import BodyParseConfig from "../../interfaces/bodyParserConfig"

// Utils
import FileHandler from "../../utils/FileHandler"


export default function buildBodyParserMiddleware (config?: Partial<BodyParseConfig>) {
	const BodyParserMiddleware: MiddlewareType = async (request, n) => {
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
				.parse(request.raw && request.raw(), (_, fields, prefiles) => {
				// wrap files in helper class
					const files = {}

					Object.keys(prefiles).forEach(key => {
						files[key] = new FileHandler(prefiles[key], config)
					})

					resolve({
						...request,
						body: {
							...fields as any,
							...files,
						},
					})
				})
		}))
	}

	return BodyParserMiddleware
}