import dts from "rollup-plugin-ts"
import esbuild from "rollup-plugin-esbuild"
import nodeResolve from "@rollup/plugin-node-resolve"
import globals from "rollup-plugin-node-globals"
import {uglify} from "rollup-plugin-uglify"

const name = "dist/index"

const bundle = config => ({
	...config,
	input: "src/index.ts",
})

export default [
	bundle({
		plugins: [nodeResolve({ preferBuiltins: true }), esbuild({
			minify: true,
			experimentalBundling: true,
		}), globals(), uglify()],
		output: [
			{
				file: `${name}.js`,
				format: "cjs",
				sourcemap: true,
				exports: "named",
			},
			{
				file: `${name}.mjs`,
				format: "es",
				sourcemap: true,
				exports: "named",
			},
		],
	}),
	bundle({
		plugins: [globals(), nodeResolve({ preferBuiltins: true }), dts()],
		output: {
			file: `${name}.d.ts`,
			format: "es",
		},
	}),
]