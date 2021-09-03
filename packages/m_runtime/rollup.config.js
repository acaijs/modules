import dts from "rollup-plugin-ts"
import esbuild from "rollup-plugin-esbuild"
import nodeResolve from "rollup-plugin-node-resolve"
import globals from "rollup-plugin-node-globals"
import builtins from "rollup-plugin-node-builtins"

const name = "dist/index"

const bundle = config => ({
	...config,
	input: "src/index.ts",
})

export default [
	bundle({
		plugins: [nodeResolve({ preferBuiltins: true }), globals(), builtins(), esbuild({
			minify: true,
			experimentalBundling: true,
		})],
		output: [
			{
				file: `${name}.js`,
				format: "cjs",
				sourcemap: true,
				exports: "auto",
			},
			{
				file: `${name}.mjs`,
				format: "es",
				sourcemap: true,
				exports: "auto",
			},
		],
	}),
	bundle({
		plugins: [nodeResolve({ preferBuiltins: true }), globals(), builtins(), dts()],
		output: {
			file: `${name}.d.ts`,
			format: "es",
		},
	}),
]