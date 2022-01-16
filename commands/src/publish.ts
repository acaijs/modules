// Utils
import { exec } from "child_process"
import axios from "./utils/request"
import { cli, colored, exception } from "./utils/terminal"

async function publish () {
	const commit = process.env.COMMIT

	if (!commit) exception("You must provide a commit sha")

	const { data } = await axios(`https://api.github.com/repos/AcaiJS/modules/commits/${commit}?per_page=1&sha=${commit}`)
	const configs = data.files.filter(i => i.filename.match(/packages\/.+\/package\.json/))
	const packages = {}

	configs
		.filter(file => file.patch.match(/\+\t"version": "/))
		.forEach(file => {
			const module = file.filename.replace(/(packages\/|\/src\/.+|\/package\.json)/g, "")
			const version = file.patch.split(/\+.+"version": "/)[1].split("\"")[0]

			packages[module] = version
		})

	let publishedPackages = 0

	await Promise.all(Object.entries(packages).map(async pkg => {
		const [name, version] = pkg

		try {
			await axios(`https://registry.npmjs.org/@acai/${name}/${version}`)
		}
		// should publish
		catch (e) {
			publishedPackages++
			console.log(`${name}(${version}): publishing`)
			await cli(
				`yarn publish ../../packages/${name} --new-version ${version}`,
			)
				.then(() =>
					colored(
						`Published package ${name} with version ${version}`,
						"green",
					),
				)
				.catch((t) => colored(`Failed to publish package ${name}\n${t}`, "red"))
		}

	}))

	colored(`${publishedPackages} packages published`, "green")
	process.exit(0)
}

publish()