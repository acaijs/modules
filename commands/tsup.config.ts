import { defineConfig } from "tsup"

export default defineConfig({
	splitting: true,
	sourcemap: true,
	clean: true,
	entryPoints: ["src/bump.ts"],
	format: ["cjs"],
	dts: true,
})