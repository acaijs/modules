export default interface ServerConfigInterface {
	/** Encryption key used for cookies and other internal services of the server */
	key: string;

	/** Prefix that can help you scope files that can be used as controllers */
	filePrefix: string;
	/** Prefix that will close the scope of files that can be loaded with the response helper */
	viewPrefix: string;

	/** Domain for the server */
	hostname: string;
	/** Specific port for the domain */
	port: number;

	/** Generic configuration an adapter may have */
	[key: string]: any;
}