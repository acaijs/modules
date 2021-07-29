// Interfaces
import TestInterface 	from "../interfaces/testQueue";
import ExpectInterface 	from "../interfaces/expect";

// Utils
import { getStackTrace } 	from "./general";

const buildResponse = (type: keyof ExpectInterface, success: boolean, message?: string) => {
	return {
		type,
		fail: !success,
		message: success ? undefined:message,
		stack: success ? undefined:getStackTrace(),
	};
}
const buildTestAssertion = (test: TestInterface) => {
	return (valueToAssert: unknown) => {
		const assertions = function (this: ExpectInterface) {

			// -------------------------------------------------
			// toBe
			// -------------------------------------------------

			this.toBe = (valueToTest) => {
				const passes = typeof valueToAssert === "object" ? (JSON.stringify(valueToAssert) === JSON.stringify(valueToTest)) : valueToAssert === valueToTest;

				test.assertions.push(buildResponse(
					"toBe",
					passes,
					`${typeof valueToAssert !== "undefined" ? JSON.stringify(valueToAssert):valueToAssert} is not equal to ${typeof valueToTest !== "undefined" ? JSON.stringify(valueToTest):valueToTest}`
				));

				return this;
			}

			// -------------------------------------------------
			// toNotBe
			// -------------------------------------------------

			this.toNotBe = (valueToTest) => {
				const passes 	= valueToAssert !== valueToTest;

				test.assertions.push(buildResponse(
					"toNotBe",
					passes,
					`"${valueToAssert}" shouldn't be equal to ${valueToTest}`
				));

				return this;
			}

			// -------------------------------------------------
			// toBeTypeOf
			// -------------------------------------------------

			this.toBeTypeOf = (valueToTest) => {
				const passes = valueToTest === typeof valueToAssert;

				test.assertions.push(buildResponse(
					"toBeTypeOf",
					passes,
					`"${valueToAssert}" is not of the type ${valueToTest}`
				));

				return this;
			}

			// -------------------------------------------------
			// toBeDefined
			// -------------------------------------------------

			this.toBeDefined = () => {
				const passes 	= valueToAssert !== undefined;

				test.assertions.push(buildResponse(
					"toBeDefined",
					passes,
					`"${valueToAssert}" is not defined`
				));

				return this;
			}

			// -------------------------------------------------
			// toBeUndefined
			// -------------------------------------------------

			this.toBeUndefined = () => {
				const passes 	= valueToAssert === undefined;

				test.assertions.push(buildResponse(
					"toBeUndefined",
					passes,
					`"${valueToAssert}" is defined`
				));

				return this;
			}

			// -------------------------------------------------
			// toBeNull
			// -------------------------------------------------

			this.toBeNull = () => {
				const passes 	= valueToAssert === null;

				test.assertions.push(buildResponse(
					"toBeNull",
					passes,
					`"${valueToAssert}" is not null`
				));

				return this;
			}

			// -------------------------------------------------
			// toNotBeNull
			// -------------------------------------------------

			this.toNotBeNull = () => {
				const passes 	= valueToAssert !== null;

				test.assertions.push(buildResponse(
					"toNotBeNull",
					passes,
					`"${valueToAssert}" is null`
				));

				return this;
			}

			// -------------------------------------------------
			// toThrow
			// -------------------------------------------------

			this.toThrow = () => {
				let passes = false;

				try {
					(valueToAssert as () => any)();
				}
				catch (e) {
					passes = true;
				}

				test.assertions.push(buildResponse(
					"toThrow",
					passes,
					`"${valueToAssert}" dind't throw an exception`
				));

				return this;
			}

			// -------------------------------------------------
			// cache
			// -------------------------------------------------

			this.cache = (title?: string) => {
				test.messages.push([valueToAssert, title]);

				return this;
			}

			// -------------------------------------------------
			// toContain
			// -------------------------------------------------

			this.toContain = (contain: string | string[]) => {
				let remains: string[] = [];

				if (Array.isArray(valueToAssert)) {
					const compare = Array.isArray(contain) ? contain:[contain];

					remains = compare.filter(i => valueToAssert.find(x => x !== i));
				}
				else if (typeof valueToAssert === "object") {
					const keys = Object.keys(valueToAssert || {});
					const compare = Array.isArray(contain) ? contain:[contain];

					remains = compare.filter(i => keys.find(x => x !== i));
				}
				else if (typeof valueToAssert === "string") {
					const compare = Array.isArray(contain) ? contain:[contain];

					remains = compare.filter(i => !valueToAssert.match(i));
				}

				test.assertions.push(buildResponse(
					"toContain",
					remains.length === 0,
					`"${valueToAssert}" dind't contain values: ${remains.join(", ")}`
				));

				return this;
			}

			return this;
		}

		return assertions.bind({} as ExpectInterface)();
	}
}

export default buildTestAssertion;