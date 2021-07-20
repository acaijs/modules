// Utils
import * as GroupQueue 					from "../utils/group";
import * as TestQueue 					from "../utils/test";
import * as ContextQueue 				from "../utils/context";
import { getStackTrace, isArrayEquals } from "../utils/general";

// Interfaces
import ContextInterface 		from "../interfaces/context";
import GroupAuxiliaryInterface 	from "../interfaces/groupAuxiliary";
import TestInterface 			from "../interfaces/testQueue";
import ContextErrorInterface 	from "../interfaces/contextError";
import RunSettings 				from "../interfaces/runSettings";

let currTest;
export const getCurr = () => currTest;

export default async function run (settings?: RunSettings) {
	// -------------------------------------------------
	// Run all groups
	// -------------------------------------------------

	for (let groups: {ctx: ContextInterface, cb: (aux: GroupAuxiliaryInterface) => void}[] = GroupQueue.get(); groups.length > 0; groups = GroupQueue.get()) {
		GroupQueue.clear();

		await Promise.all(groups.map((group) => {
			ContextQueue.set(group.ctx);
			return group.cb({} as any);
		}));
	}

	// -------------------------------------------------
	// Filter
	// -------------------------------------------------

	const tests = TestQueue.get(settings?.tags || [], !settings?.forceAll);
	const contextFails = [] as ContextErrorInterface[];

	// -------------------------------------------------
	// Run tests
	// -------------------------------------------------
	
	const states = [ "─", "\\", "|", "/" ];
	let testsrun = 0;
	let laststep = 0;

	const waitProcess = setInterval(() => {
		if (settings?.spinner !== false) {
			console.clear();
			console.log(`\n ${states[laststep]} (${testsrun}/${tests.length}) Running tests`);
	
			if (laststep + 2 > states.length) laststep = 0;
			else laststep++;
		}
	}, 250);

	// -------------------------------------------------
	// Run tests
	// -------------------------------------------------

	let lastcontext	: string[] = [];
	let lasttest	: TestInterface = {} as TestInterface;

	const processStart = process.hrtime();

	for (let i = 0; i < tests.length; i++) {
		const test = tests[i];
		currTest = test;

		// check context for beforeAll
		if (!isArrayEquals(lastcontext, test.group)) {
			try {
				await Promise.all(test.beforeAll.map( i => i()));
			}
			catch (e) {
				let ctx = contextFails.find(i => isArrayEquals(i.group, test.group));

				if (!ctx) {
					contextFails.push({
						group: test.group,
						fails: [],
					});

					ctx = contextFails[contextFails.length - 1];
				}

				ctx.fails.push({
					title	: e.message,
					type	: "beforeAll",
					message	: "An error has occured while running beforeAll callback",
					stack	: getStackTrace(1, e),
				});
			}
		}

		// check context for before each
		try {
			await Promise.all(test.beforeEach.map(i => i()));
		}
		catch (e) {
			test.assertions.push({
				type	: "beforeEach",
				message	: "An error has occured while running beforeEach callback",
				stack	: getStackTrace(1, e),
				fail	: true,
			});
			
			let ctx = contextFails.find(i => isArrayEquals(i.group, test.group));

			if (!ctx) {
				contextFails.push({
					group: test.group,
					fails: [],
				});

				ctx = contextFails[contextFails.length - 1];
			}

			ctx.fails.push({
				title	: e.message,
				type	: "beforeEach",
				message	: "An error has occured while running beforeEach callback",
				stack	: getStackTrace(1, e),
			});
		}

		// update context
		lastcontext = test.group;
		lasttest 	= test;
		testsrun++;

		// run test
		try {
			await new Promise((resolve, reject) => async () => {
				// timer for timeout
				const timer = setTimeout(() => { reject(""); }, test.timeout || settings?.timeout || 2000);
		
				// test to run
				await (test as unknown as {callback: () => void}).callback();
				clearTimeout(timer);
				resolve("");
			});
		}
		catch (e) {
			test.assertions.push({
				type	: "timeout",
				message	: "Timeout",
				name	: "Your test has thrown an timeout after it has been unnresponsive for 2 seconds, you can change this time by changing the run settings timeout or changing the test timeout",
				stack	: "",
				fail	: true,
			});
		}

		// check context for after each
		try {
			await Promise.all(test.afterEach.map(i => i()));
		}
		catch (e) {
			test.assertions.push({
				type	: "afterEach",
				message	: "An error has occured while running afterEach callback",
				stack	: getStackTrace(1, e),
				fail	: true,
			});
			
			let ctx = contextFails.find(i => isArrayEquals(i.group, test.group));

			if (!ctx) {
				contextFails.push({
					group: test.group,
					fails: [],
				});

				ctx = contextFails[contextFails.length - 1];
			}

			ctx.fails.push({
				title	: e.message,
				type	: "afterEach",
				message	: "An error has occured while running afterEach callback",
				stack	: getStackTrace(1, e),
			});
		}
	}

	// check context for after All
	if (lasttest) {
		try {
			await Promise.all(lasttest.afterAll.map( i => i()));
		}
		catch (e) {			
			let ctx = contextFails.find(i => isArrayEquals(i.group, lasttest.group));

			if (!ctx) {
				contextFails.push({
					group: lasttest.group,
					fails: [],
				});

				ctx = contextFails[contextFails.length - 1];
			}

			ctx.fails.push({
				title	: e.message,
				type	: "afterAll",
				message	: "An error has occured while running afterAll callback",
				stack	: getStackTrace(1, e),
			});
		}
	}
	const processEnd = process.hrtime(processStart);
	clearInterval(waitProcess);
	if (settings?.spinner !== false) {
		console.clear();
	}
	
	return [tests, contextFails, processEnd] as [TestInterface[], ContextErrorInterface[], [number, number]];
}