export default interface SettingsConfigInterface extends Record<string, string | number | undefined> {
	hostname	: string;
	username	: string;
	db			: string;
	poolSize   ?: number;
	password	: string;
}