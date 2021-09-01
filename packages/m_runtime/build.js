const swc = require("@swc/core")
const path = require("path")

const shareable = (entry, type) => swc.transformFile(path.join(process.cwd(), entry), {
	filename: "index.ts",
	jsc: {
		target: "es5",
		parser: {
			syntax: "typescript",
			decorators: true,
			dynamicImport: true,
		},
		externalHelpers: true,
	},
	module: {
		type: type,
		strict: true,
	},
	outputPath: "/dist",
	minify: true,
	sourceMaps: true,
})

async function main () {
	await shareable("./src/index.ts", "amd")
	await shareable("./src/index.ts", "commonjs")
}

main()