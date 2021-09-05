import dts from "rollup-plugin-ts"
import esbuild from "rollup-plugin-esbuild"
import nodeResolve from "@rollup/plugin-node-resolve"
import globals from "rollup-plugin-node-globals"
import {uglify} from "rollup-plugin-uglify"

const buildProduction = (bundles = [], buildDefault = true) => {
	const standard = buildDefault && buildProduction([{entry: "index.ts"}], false)
	const response = standard || []

	bundles.map(bundle => [
		{
			input: `src/${bundle.entry || "index.ts"}`,
			plugins: [nodeResolve({ preferBuiltins: true }), esbuild({
				minify: true,
				experimentalBundling: true,
			}), globals(), uglify()],
			output: [
				{
					file: `dist/${bundle.output || bundle.entry || "index"}.js`,
					format: "cjs",
					sourcemap: true,
					exports: "named",
				},
				{
					file: `dist/${bundle.output || bundle.entry || "index"}.es.js`,
					format: "es",
					sourcemap: true,
					exports: "named",
				},
			],
		},
		{
			input: `src/${bundle.entry || "index.ts"}`,
			plugins: [globals(), nodeResolve({ preferBuiltins: true }), dts()],
			output: {
				file: `dist/${bundle.output || bundle.entry || "index"}.d.ts`,
				format: "es",
			},
		},
	]).forEach(i => {response.push(i[0]); response.push(i[1])})

	return response
}

export default buildProduction