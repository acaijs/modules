// Utils
import axios from "axios"
import { colored, exception } from "./utils/terminal"

async function verify () {
	const pullrequest = process.env.PULL_REQUEST

	if (!pullrequest) exception("You must provide a pull request identifier")

	let page = 1
	const files: string[] = []
	const packages: Record<string, string> = {}

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const { data } = await axios(`https://api.github.com/repos/AcaiJS/modules/pulls/${pullrequest}/files?per_page=100&page=${page}`)

		data.filter(file => file.filename.match(/^packages\/.+\/.+/))
			.forEach(file => {
				files.push(file.filename)

				if (file.filename.match(/package\.json/) && file.patch.match(/\\"version\\": \\"/)) {
					const module = file.filename.replace(/(packages\/|\/src\/.+)/g, "")
					const version = file.patch.replace(/.+\\"version\\": \\"/, "").split(/\\"/, "")[0]

					packages[module] = version
				}
			})

		if (data.length !== 100) break
		page++
	}

	const affectedPackages = [
		...new Set(
			files
				.filter(file => file.match(/^packages\/.+\/src\/.+/))
				.map(file => file.replace(/(packages\/|\/src\/.+)/g, "")),
		),
	]

	if (affectedPackages.length === 0) {
		colored("No package to publish", "blue")
		return
	}

	const withBump = affectedPackages.filter(pkg => packages[pkg])

	await Promise.all(withBump.map(async name => {
		const version = packages[name]

		const { status } = await axios(`https://registry.npmjs.org/@acai/${name}/${version}`)

		if (status === 200) exception (`You need to bump the package ${name} to another version (current version ${version} already published)`)
	}))

	colored("You are good to go", "green")
	process.exit(0)
}

verify()