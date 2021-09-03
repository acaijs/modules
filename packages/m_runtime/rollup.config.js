import dts from "rollup-plugin-ts"
import esbuild from "rollup-plugin-esbuild"

const name = "../m_router/dist/index"

const bundle = config => ({
	...config,
	input: "../m_router/src/index.ts",
})

export default [
	bundle({
		plugins: [esbuild({
			minify: true,
			experimentalBundling: true,
		})],
		output: [
			{
				file: `${name}.js`,
				format: "cjs",
				sourcemap: true,
			},
			{
				file: `${name}.mjs`,
				format: "es",
				sourcemap: true,
			},
		],
	}),
	bundle({
		plugins: [dts()],
		output: {
			file: `${name}.d.ts`,
			format: "es",
		},
	}),
]