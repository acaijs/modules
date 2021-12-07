import rollup from "rollup"
import ConfigInterface from "../interfaces/config"
import buildConfig from "./buildConfig"

async function buildBundle(bundles: ConfigInterface[] = [], buildDefault = true) {
	const config = buildConfig(bundles, buildDefault)

	await Promise.all(config.map(async config => {
		// create a bundle
		const bundle = await rollup.rollup(config)

		// or write the bundle to disk
		await bundle.write(config)

		// closes the bundle
		await bundle.close()
	}))
}

export default buildBundle