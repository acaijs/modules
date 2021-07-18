// Packages
import * as fs 		from "fs";
import * as path 	from "path";

// Interfaces
import StubConfigInterface from "../interfaces/stubConfig";

// Utils
import getStubs from "./getStubs";

export default function listStubs (stubpath: string) {
	const stubs 	= getStubs(stubpath);

	stubs.forEach((item) => {
		const configFilePath 	= path.join(process.cwd(), stubpath, item.name, "stub.config.json");

		// load config file
		let config = JSON.parse(fs.readFileSync(configFilePath, {encoding: "utf-8"})) as StubConfigInterface;
		console.log(`\nstub: ${config.name}`);
		if (config.description) console.log("description:", config.description.length > 70 ? `${config.description.substring(0, 70)}...`:config.description);
	});
}