import { defineConfig } from "tsup"

export default defineConfig({
	splitting: true,
	sourcemap: true,
	clean: true,
	entryPoints: [
		"src/bump.ts",
		"src/verify.ts",
		"src/duplicate.ts",
		"src/publish.ts",
	],
	format: ["cjs"],
	dts: true,
})