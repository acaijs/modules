import rollup from "rollup"

import ConfigInterface from "./config"

export default interface BuildInterface {
	(bundles?: ConfigInterface[], buildDefault?: boolean): Promise<void>;

	config: (bundles?: ConfigInterface[], buildDefault?: boolean) => rollup.RollupOptions;
}