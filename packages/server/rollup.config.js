import buildProduction from "@acai/runtime"
import pckg from "./package.json"

const deps = [...Object.keys({...pckg.dependencies, ...pckg.peerDependencies, ...pckg.devDependencies}), "http"]

const build = buildProduction([
	{entry: "index.ts", output: "index", external: deps},
], false)

export default build