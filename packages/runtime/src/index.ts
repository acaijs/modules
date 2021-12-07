// Imports
import buildConfig from "./modules/buildConfig"
import buildBundle from "./modules/buildBundle"

// Interfaces
import BuildInterface from "./interfaces/build"

const build = buildBundle as BuildInterface
build.config = buildConfig

export default build