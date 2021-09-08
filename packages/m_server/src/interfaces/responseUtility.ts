export default interface ResponseUtilityOptions {
	view	: string;
	status	: number;
	body	: unknown;
	headers	: Record<string, string>;
}