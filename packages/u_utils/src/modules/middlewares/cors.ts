// Packages
import { ServerRequest } from "@acai/interfaces"
import CorsConfigInterface from "../../interfaces/corsConfig"

const parseIntoObject = (key: string) => (value: string | boolean) => value ? {[`Access-Control-${key}`]: value as string} : {}

const parseValue = (value?: string | string[], fallback: string | undefined = undefined) => {
	if (!value) return fallback === undefined ? false : "*"

	if (typeof value === "string") return value

	return value.join(", ")
}

const handleOrigin = (value: string, config?: Partial<CorsConfigInterface>["origin"]) => {
	if (typeof config !== "function" || !value) return parseValue(value, undefined)

	return config(value) && value
}

const buildCorsMiddleware = (config?: Partial<CorsConfigInterface>) => (request: ServerRequest, next: (r: ServerRequest) => any) => next({
	...request,
	headers: {
		...(request?.headers || {}),
		...parseIntoObject("Allow-Origin")(handleOrigin(request.headers.host, config?.origin)),
		...parseIntoObject("Allow-Methods")(parseValue(config?.methods)),
		...parseIntoObject("Allow-Headers")(parseValue(config?.headers)),
		...parseIntoObject("Expose-Headers")(parseValue(config?.exposed)),
		...parseIntoObject("Allow-Credentials")(parseValue(`${config?.support_credentials}`, "false")),
	},
})

export default buildCorsMiddleware