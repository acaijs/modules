import dts from "rollup-plugin-ts"
import esbuild from "rollup-plugin-esbuild"
import nodeResolve from "@rollup/plugin-node-resolve"
import globals from "rollup-plugin-node-globals"
import banner from "rollup-plugin-banner2"

const bannerText = "/**\n * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n **/\n\n"

const buildProduction = (bundles = [], buildDefault = true) => {
	const standard = buildDefault && buildProduction([{entry: "index.ts"}], false)
	const response = standard || []

	bundles.map(bundle => {
		const { entry, output, ...config } = bundle

		return [
			{
				...config,
				input: `src/${entry || "index.ts"}`,
				plugins: [
					nodeResolve({ preferBuiltins: true }),
					esbuild({
						// minify: true,
						experimentalBundling: true,
					}),
					globals(),
					// uglify(),
					banner(() => bannerText),
				],
				output: [
					{
						file: `dist/${output || entry.split(".")[0] || "index"}.js`,
						format: "cjs",
						sourcemap: true,
						exports: "named",
					},
					{
						file: `dist/${output || entry.split(".")[0] || "index"}.es.js`,
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
					nodeResolve({ preferBuiltins: true }),
					globals(),
					dts(),
					banner(() => bannerText),
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

export default buildProduction