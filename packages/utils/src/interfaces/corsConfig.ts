export default interface CorsConfigInterface {
	origin: "*" | string | string[] | ((origin: string) => boolean);
	methods: "*" | string | string[];
	headers: "*" | string | string[];
	exposed: "*" | string | string[];
	support_credentials: boolean;
}