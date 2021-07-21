// Interface
import TestInterface, { TestArgumentInterface } from "../interfaces/testQueue";

// Utils
import assertions			from "./assertions";
import { getStackTrace, isArrayEquals }	from "./general";

const tests: TestInterface[] = [];
let only 	= false;
let except 	= false;

export const get = (tag: string[], filter = false) => {
	return tests
		.filter(test => {
			if (filter) {
				if (only) 		return test.only;
				if (except) 	return !test.except;
				if (tag.length) return tag.find(tag => test.tags.find(subtag => subtag === tag));
			}

			return true;
		})
		.sort((test1, test2) => {
			// same group, keep it as it is
			if (isArrayEquals(test1.group, test2.group)) return 0;

			if (test1.group.length > test2.group.length)
				return test1.group.filter((item, index) => item === test2.group[index]).length - 1;

			return test2.group.filter((item, index) => item === test1.group[index]).length + 1;
		});
}

export const append = (test: Partial<TestInterface>) => {
	tests[tests.length - 1] = {
		...tests[tests.length - 1],
		...test,
		tags: [...(tests[tests.length - 1].tags || []), ...(test.tags || [])],
		messages: [...(tests[tests.length - 1].messages || []), ...(test.messages || [])],
	}
}

export const add = (pretest: Omit<TestArgumentInterface, "fail">) => {
	// filter for perfomance
	if (pretest.only) 		only 	= true;
	if (pretest.except) 	except 	= true;

	// build test
	const test: TestInterface = {
		only		: false,
		except		: false,
		fail		: false,
		assertions	: [],
		messages	: [],

		...pretest,
	};

	// encapsulate callback
	const rawcallback = test.callback;
	test.callback = async () => {
		try {
			await rawcallback(assertions(test))
		}
		catch (e) {
			test.fail = true;

			test.assertions.push({
				type	: "test",
				fail	: true,
				message	: "Exception thrown",
				name	: e.message,
				stack	: getStackTrace(1, e),
			})
		}
	}

	// add to list
	tests.push(test);
}
