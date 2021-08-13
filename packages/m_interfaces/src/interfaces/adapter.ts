export default interface AdapterInterface {
	boot (config: Record<string, any>): Promise<boolean> | boolean;
	shutdown (): Promise<void> | void;

	onRequest (req: (() => any)): Promise<void> | void;

	onParse (response: any): any;
}
