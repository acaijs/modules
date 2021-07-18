export default interface ContextErrorInterface {
	group: string[];
	fails: {
		stack: string;
		title: string;
		message: string;
		type: string;
	}[]
}