import Assertion from "../utils/Assertion"

export default interface TestInterface {
	// basic necessary
	description: string;
	context: string[];
	callback: () => void;
	assertions: {
		type: keyof ReturnType<ReturnType<typeof Assertion>>;
		skipped: boolean;
		pass: boolean;
		message: string;
	}[];

	// extra
	only?: boolean;
	except?: boolean;
	wip?: boolean;
	tags?: string[];
}

export type TestOptionsInterface = Omit<TestInterface, "description" | "context" | "callback" | "assertions">;