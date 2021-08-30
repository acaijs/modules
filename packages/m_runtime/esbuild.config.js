const { build } = require("esbuild")

const shareable = (config) => build({
	entryPoints: ["src/index.ts"],
	external: ["npm-dts", "chokidar", "esbuild"],
	bundle: true,
	minify: true,
	incremental: false,
	sourcemap: "inline",
	logLevel: "info",
	platform: "node",
	...config,
})

async function main () {
	await shareable({outfile: "dist/index.esm.js", format: "esm"})
	await shareable({outfile: "dist/index.cjs.js", format: "cjs"})

	// special build for cli
	await shareable({ entryPoints: ["src/cli.ts"], outfile: "dist/cli.js" })
}

main()