// Utils
import dayjs from "dayjs"
import axios from "./utils/request"
import { cli, colored, exception } from "./utils/terminal"

async function publish () {
	const commit = process.env.COMMIT

	if (!commit) exception("You must provide a commit sha")

	const { data } = await axios(`https://api.github.com/repos/AcaiJS/modules/commits/${commit}?per_page=1&sha=${commit}`)
	const alterDate = data.commit.author.date
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
			const { data } = await axios(`https://registry.npmjs.org/@acai/${name}/${version}`)
			const [,stamp] = data._npmOperationalInternal.tmp.split("_").reverse()

			if (dayjs(stamp).isBefore(dayjs(alterDate).add(1, "hour"))) throw new Error("Release should happen after the commit")
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