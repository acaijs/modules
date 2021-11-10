// Modules
import run 		from "./run"
import print 	from "./print"

// Interfaces
import RunSettings from "../interfaces/runSettings"

export default async function runAndPrint(settings?: RunSettings) {
	const result = await run(settings)

	if (settings?.spinner !== false) {
		await print(...result)
	}
}