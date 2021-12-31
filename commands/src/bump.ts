// Packages
import { join } from "path"
import { promises as fs } from "fs"

// Utils
import { exists } from "./utils/file"
import { bump } from "./utils/versioning"
import { colored, exception, cli } from "./utils/terminal"

async function main() {
	const body = process.env.RELEASE!

	if (!body) {
		exception("Release body was not given")
	}

	const clearlines = body
		.split(/(\r\n|\r|\n)/)
		.filter((i) => i)
		.filter((i) => !(i === "\r" || i === "\n"))
	const lines = clearlines.map((i) => i.toLowerCase())

	// no version bump
	if (!lines.includes("# packages")) {
		colored("Markdown doesn't contain version declaration", "blue")
		return
	}

	const versionList = {} as Record<string, { next: string; current: string; bump: string }>
	const startIndex = lines.indexOf("# packages")

	for (let i = startIndex + 1; i < lines.length; i++) {
		const item = lines[i]

		// version list ended
		if (!item.match(/^-/)) break

		const [module, version] = item
			.split("-")[1]
			.split(":")
			.map((i) => i.trim())

		if (!module) {
			exception("Package list is malformed, couldn't find package name")
		}
		if (!version) {
			exception(
				"Package list is malformed, couldn't find version for package " + module,
			)
		}
		if (!["patch", "minor", "major", "major beta", "major alpha", "minor beta",	"minor alpha", "beta", "alpha"].includes(version)) {
			exception(`Package ${module} does not contain a valid version bump`)
		}
		if (versionList[module]) {
			exception(`Package ${module} is declared more than once`)
		}
		const pkcgjsonfile = join(`${process.cwd()}/../packages/${module}`)
		if (!(await exists(pkcgjsonfile + "/package.json"))) {
			exception(`Package ${module} does not exist`)
		}

		// get version from package json
		const pckgjson = await fs.readFile(pkcgjsonfile + "/package.json", "utf-8").then(JSON.parse)

		versionList[module] = {
			bump: version,
			current: pckgjson.version,
			next: bump(pckgjson.version, version),
		}
	}

	if (Object.keys(versionList).length === 0) {
		colored("No package to publish", "blue")
	}

	await Promise.all(
		Object.entries(versionList).map(async (pckg) => {
			await cli(
				`yarn publish ${process.cwd()}/../packages/${pckg[0]} --new-version ${pckg[1].next
				}`,
			)
				.then(() =>
					colored(
						`Published package ${pckg[0]} with version ${pckg[1].next}`,
						"green",
					),
				)
				.catch((t) => colored(`Failed to publish package ${pckg[0]}\n${t}`, "red"))

			return pckg
		}),
	)
}

main()
