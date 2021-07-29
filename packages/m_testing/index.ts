// Modules
import runMethod 			from "./src/modules/run";
import testMethod			from "./src/modules/test";
import findMethod 			from "./src/modules/find";
import cacheMethod 			from "./src/modules/cache";
import groupMethod 			from "./src/modules/group";
import onlyMethod 			from "./src/modules/only";
import exceptMethod 		from "./src/modules/except";
import tagMethod 			from "./src/modules/tag";
import printMethod 			from "./src/modules/print";
import runAndPrintMethod 	from "./src/modules/runAndPrint";

// Interfaces
import TestModuleInterface from "./src/interfaces/testModule";

// build
const test 			= testMethod as TestModuleInterface;
test.run 			= runMethod;
test.find			= findMethod;
test.group 			= groupMethod;
test.cache 			= cacheMethod;
test.only 			= onlyMethod;
test.except			= exceptMethod;
test.tag			= tagMethod;
test.print			= printMethod;
test.runAndPrint	= runAndPrintMethod;

// export
export default test;

async function main () {
	const path 	= process.argv.includes("--path") 		&& process.argv[process.argv.indexOf("--path") + 1];
	const tags 	= `${process.argv.includes("--tags") 	&& process.argv[process.argv.indexOf("--tags") + 1] || ""}`.split(",").filter(i => i);
	const all	= process.argv.includes("--all");
	const print	= !process.argv.includes("--no-print");

	await test.find(path || "./**/*.{test,tests}.{js,ts}");
	await test.runAndPrint({
		tags	: tags,
		forceAll: all,
		spinner	: print,
	});
}

// run from command line
if (process.argv.includes("--run")) {
	main();
}