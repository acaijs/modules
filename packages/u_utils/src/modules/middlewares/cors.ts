// Packages
import { ServerRequest } from "@acai/interfaces"
import { response } from "../.."
import CorsConfigInterface from "../../interfaces/corsConfig"

const parseIntoObject = (key: string) => (value: string | boolean) => value ? {[`Access-Control-${key}`]: value as string} : {}

const parseValue = (value?: string | number | boolean | string[], fallback?: string) => {
	if (!value) return fallback || false

	if (Array.isArray(value)) return value.join(", ")

	return `${value}`
}

const handleOrigin = (value: string, config?: Partial<CorsConfigInterface>["origin"]) => {
	if (!config) return false

	if (typeof config !== "function") return parseValue(config)

	return config(value) && value
}

const buildCorsMiddleware = (config?: Partial<CorsConfigInterface>) => (request: ServerRequest, next: (r: ServerRequest) => any) => {
	const headers = {
		...(request?.headers || {}),
		...parseIntoObject("Allow-Origin")(handleOrigin(request.headers.host, config?.origin)),
		...parseIntoObject("Allow-Methods")(parseValue(config?.methods)),
		...parseIntoObject("Allow-Headers")(parseValue(config?.headers)),
		...parseIntoObject("Expose-Headers")(parseValue(config?.exposed)),
		...parseIntoObject("Allow-Credentials")(parseValue(config?.support_credentials)),
	}

	if (request.method.toLowerCase() === "options") return response().status(204).headers(headers).body("")

	return next({
		...request,
		headers,
	})
}

export default buildCorsMiddleware