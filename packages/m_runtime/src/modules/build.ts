// Packages
import { build as esbuild } from "esbuild"

const isProduction = process.env.NODE_ENV === "production"

const esbuildBuild = (config: Record<string, any>, optional?: string[]) => esbuild({
	entryPoints: ["src/index.ts"],
	bundle: true,
	external: optional,
	minify: isProduction,
	incremental: !isProduction,
	sourcemap: "inline",
	platform: "node",
	logLevel: "info",
	...config,
})

const build = async (pkg) => {
	const opt = Object.keys({...(pkg?.dependencies || {}), ...(pkg?.peerDependencies || {}), ...(pkg?.optionalDependencies || {})})

	await esbuildBuild({outfile: "dist/index.esm.js", format: "esm"}, opt)
	await esbuildBuild({outfile: "dist/index.cjs.js", format: "cjs"}, opt)

	process.exit()
}

export default build
