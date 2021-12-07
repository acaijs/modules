// packages
const { join } = require("path")
const { promises } = require("fs")

const exists = (dir) => promises.access(dir).then(() => true).catch(() => false)

async function main () {
	const configFile = await promises.readFile(join(process.cwd(), "./rush.json"), { encoding: 'utf-8' })
	const configParsed = configFile.replace(/\/\*.+([\s\S]*?)\*\//gm, '')
	const config = JSON.parse(configParsed)

	await Promise.all(config.projects.map(async (project) => {
		const dir = join(process.cwd(), project.projectFolder, 'dist')

		if (await exists(dir)) {
			console.log(`Removing prod dir from ${project.packageName}`)
			await promises.rm(dir, { recursive: true, force: true })
		}
	}))
}

main()
