import { defineConfig } from "tsup"

export default defineConfig({
	splitting: true,
	sourcemap: true,
	clean: true,
	entryPoints: ["src/index.ts"],
	format: ["cjs", "esm"],
	dts: true,
})