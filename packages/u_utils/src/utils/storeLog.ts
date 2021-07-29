// Packages
import * as fs		from "fs";
import * as path	from "path";

export default function storeLog (location: string, log: any) {
	const now			= new Date();
	const filename		= `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}.log`;
	const pathString	= path.join(process.cwd(), location);

	// make sure storage path exists
	if (!fs.existsSync(pathString))
		fs.mkdirSync(pathString);

	// make sure file exists
	if (!fs.existsSync(path.join(pathString, filename)))
		fs.writeFileSync(path.join(pathString, filename), "", { encoding: "utf-8" });

	// append log to file
	fs.appendFileSync(path.join(pathString, filename), `Error - ${log.message} (${now.toISOString()})\nStack\n${log.trace.map(i => `- ${i}\n`).join("")}\n\n`);
}