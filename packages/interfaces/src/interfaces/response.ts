export default interface ResponseInterface {
	status	?: number;
	body	?: string;
	headers ?: Record<string, number | boolean | string>;
}