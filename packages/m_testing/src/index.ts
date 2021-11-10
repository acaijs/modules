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