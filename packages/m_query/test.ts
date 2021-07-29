// Packages
import test from "@acai/testing";

async function main () {
	const path 	= process.argv.includes("--path") 		&& process.argv[process.argv.indexOf("--path") + 1];
	const tags 	= `${process.argv.includes("--tags") 	&& process.argv[process.argv.indexOf("--tags") + 1] || ""}`.split(",").filter(i => i);
	const all	= process.argv.includes("--all");
	const print	= !process.argv.includes("--no-print");

	await test.find(path || "./src/**/*.{test,tests}.{js,ts}");
	await test.runAndPrint({
		tags	: tags,
		forceAll: all,
		spinner	: print,
	});

	process.exit(0);
}

main();