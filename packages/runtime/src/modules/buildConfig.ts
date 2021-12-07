import dts from "rollup-plugin-ts"
import esbuild from "rollup-plugin-esbuild"
import nodeResolve from "@rollup/plugin-node-resolve"
import globals from "rollup-plugin-node-globals"
import bannerPlugin from "rollup-plugin-banner2"
import ConfigInterface from "../interfaces/config"
import del from "rollup-plugin-delete"

/**
 * ### Build
 *
 * @param bundles Other bundles that are not default that you wish to build
 * @param buildDefault Builds a default bundle with the standard configuration
 * @returns
 */
const buildConfig = (bundles: ConfigInterface[] = [], buildDefault = true) => {
	const standard = buildDefault && buildConfig([{entry: "index.ts"}], false)
	const response = standard || []

	bundles.map(bundle => {
		const { entry, output, banner, ...config } = bundle
		const outputFile = output || entry.split(".")[0] || "index"

		return [
			{
				...config,
				input: `src/${entry || "index.ts"}`,
				plugins: [
					del({ targets: [ `${outputFile}.js`, `${outputFile}.es.js` ] }),
					nodeResolve({ preferBuiltins: true }),
					esbuild({
						// minify: true,
						experimentalBundling: true,
					}),
					globals(),
					// uglify(),
					bannerPlugin(() => banner),
				],
				output: [
					{
						file: `dist/${outputFile}.js`,
						format: "cjs",
						sourcemap: true,
						exports: "named",
					},
					{
						file: `dist/${outputFile}.es.js`,
						format: "es",
						sourcemap: true,
						exports: "named",
					},
				],
			},
			{
				...config,
				input: `src/${entry || "index.ts"}`,
				plugins: [
					del({ targets: [ `${outputFile}.d.js` ] }),
					nodeResolve({ preferBuiltins: true }),
					globals(),
					dts(),
					bannerPlugin(() => banner),
				],
				output: {
					file: `dist/${output || entry.split(".")[0] || "index"}.d.ts`,
					format: "es",
					exports: "named",
					sourcemap: false,
				},
			},
		]
	}).forEach(i => {response.push(i[0]); response.push(i[1])})

	return response
}

export default buildConfig