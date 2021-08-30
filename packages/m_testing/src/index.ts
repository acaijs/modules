// Packages
import tsnode from "ts-node"

// Modules
import runMethod 			from "./modules/run"
import testMethod			from "./modules/test"
import findMethod 			from "./modules/find"
import cacheMethod 			from "./modules/cache"
import groupMethod 			from "./modules/group"
import onlyMethod 			from "./modules/only"
import exceptMethod 		from "./modules/except"
import tagMethod 			from "./modules/tag"
import printMethod 			from "./modules/print"
import runAndPrintMethod 	from "./modules/runAndPrint"

// Interfaces
import TestModuleInterface from "./interfaces/testModule"

// build
const test 			= testMethod as TestModuleInterface
test.run 			= runMethod
test.find			= findMethod
test.group 			= groupMethod
test.cache 			= cacheMethod
test.only 			= onlyMethod
test.except			= exceptMethod
test.tag			= tagMethod
test.print			= printMethod
test.runAndPrint	= runAndPrintMethod

// export
export default test

async function main () {
	tsnode.register()

	const path 	= process.argv.includes("--path") 		&& process.argv[process.argv.indexOf("--path") + 1]
	const tags 	= `${process.argv.includes("--tags") 	&& process.argv[process.argv.indexOf("--tags") + 1] || ""}`.split(",").filter(i => i)
	const all	= process.argv.includes("--all")
	const print	= !process.argv.includes("--no-print")

	await test.find(path || "./**/*.{test,tests}.{js,ts}")
	await test.runAndPrint({
		tags	: tags,
		forceAll: all,
		spinner	: print,
	})
}

// run from command line
if (process.argv.includes("--run")) {
	main()
}