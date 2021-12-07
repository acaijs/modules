import buildProduction from "../runtime/rollup.config"
import pckg from "./package.json"

const deps = Object.keys({...pckg.dependencies, ...pckg.peerDependencies, ...pckg.devDependencies})

const build = buildProduction([
	{entry: "index.ts", output: "index", external: deps},
], false)

export default build