// Utils
import { isArrayEquals, repeatString } 	from "../utils/general";

// Interfaces
import TestInterface 			from "../interfaces/testQueue";
import ContextErrorInterface 	from "../interfaces/contextError";

export default async function run (tests: TestInterface[], contextErrors: ContextErrorInterface[] = [], elapsedTime: [number, number] = [0,0]) {
	console.clear();
	console.log();

	// -------------------------------------------------
	// Display tests
	// -------------------------------------------------

	console.log("===============================");
	console.log(" Tests ran");
	console.log("===============================");
	console.log();

	if (tests.length === 0) {
		console.log("no test to run");
	}
	else {
		let lastgroup = [] as string[];

		tests.forEach(test => {
			// print test group
			if (!isArrayEquals(test.group, lastgroup)) {
				test.group.forEach((item, index) => {
					if (lastgroup[index] !== item) {
						const fails = (contextErrors.find(i => isArrayEquals(i.group, test.group))?.fails || []).map(i => `\x1b[31m${i.type}\x1b[37m`).join(",");
						console.log(`\n${repeatString("\t", index)} ${item}${fails ? ` (${fails})`:""}`);
					}
				});

				lastgroup = test.group;
			}

			// prepare assertions print
			const fail = !!test.assertions.find(a => a.fail);
			const assertions = test.assertions.map(i => `${i.fail ? "\x1b[31m":"\x1b[32m"}${i.type}\x1b[37m`).join(", ");
			console.log(`${repeatString("\t", lastgroup.length - 1)} ${lastgroup.length !== 0 ? " ":""}${fail ? "\x1b[31mx":"\x1b[32m√\x1b[37m"}\x1b[37m - ${test.title} (${assertions ? assertions: "no assertions made"})`)
		});
	}

	// -------------------------------------------------
	// Display errors
	// -------------------------------------------------

	const [ total, success ] = [tests.length, tests.filter(test => !test.assertions.find(a => a.fail)).length];

	if (total !== success) {
		console.log();
		console.log("===============================");
		console.log(" Tests failed");
		console.log("===============================");
		console.log();

		tests.forEach(test => {
			test.assertions.forEach(assertion => {
				if (assertion.fail) {
					console.log(` \x1b[31mx\x1b[37m - ${test.group.join(" \x1b[36m>\x1b[37m ")}${test.group.length > 0 ? "\x1b[36m>\x1b[37m ":""}${test.title}`);
					console.log("\x1b[31m");
					console.log(`  ${assertion.message}`);
					console.log(`    ${assertion.name}`);
					console.log(`${assertion.stack}`);
					console.log("\x1b[37m");
				}
			});
		});
	}

	if (contextErrors.length) {
		console.log();

		contextErrors.forEach((group) => {
			group.fails.forEach((fail) => {
				console.log(` \x1b[31mx\x1b[37m - ${group.group.join(" \x1b[36m>\x1b[37m ")}`);
				console.log("\x1b[31m");
				console.log(`  ${fail.message}`);
				console.log();
				console.log(fail.title);
				console.log(` ${fail.stack}`);
				console.log("\x1b[37m");
			});
		});
	}

	// -------------------------------------------------
	// Display messages
	// -------------------------------------------------

	if (tests.find(i => i.messages.length > 0)) {
		console.log();
		console.log("===============================");
		console.log(" Tests messages");
		console.log("===============================");
		console.log();

		tests.forEach(test => {
			if (test.messages.length > 0) {
				test.messages.forEach(message => {
					console.log(`•${test.group.join(" \x1b[36m>\x1b[37m ")} ${test.group.length > 0 ? "\x1b[36m>\x1b[37m ":""}${test.title}`);
					if (message[1]) console.log(`message: ${message[1]}`);
					console.log("value:", message[0]);
					console.log();
				});
			}
		});
	}

	// -------------------------------------------------
	// Display statistics
	// -------------------------------------------------

	const totalMs = Math.ceil((elapsedTime[0]* 1000000000 + elapsedTime[1]) / 1000000);
	const minutes = Math.floor(totalMs / 60000);
	const seconds = Math.floor(totalMs / 1000) - minutes * 60;
	const milisec = totalMs % 1000;

	console.log();
	console.log("===============================");
	console.log(" Tests results");
	console.log("===============================");
	console.log();
	console.log(` Total tests:\t\t${total}`);
	console.log(` Successful tests:\t${success}`);
	console.log(` Total time elapsed:\t${minutes ? `${minutes}m `:""}${seconds ? `${seconds}s `:""}${milisec}ms`);
	console.log();

	if (total !== success) process.exit(1);
}