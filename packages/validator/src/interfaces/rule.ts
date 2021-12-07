type signature<response> = (data: {
	value: unknown;
	key: string;
	fields: Record<string, unknown>;
	args?: string[];
	rules: string[];
}) => response;

export default interface RuleInterface {
	/** Validation to check if value should pass */
	onValidate	?: signature<boolean>;
	/** Message to be returned in case of validation error */
	onError		?: signature<string|string[]>;
	/** Formats the validated field, runs after validation rule */
	onMask		?: signature<unknown>;
}