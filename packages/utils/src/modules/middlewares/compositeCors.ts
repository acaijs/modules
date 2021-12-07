import { ServerRequest } from "@acai/interfaces"
import CorsConfigInterface from "../../interfaces/corsConfig"
import buildCorsMiddleware from "./cors"

const buildCompositeCors = (types: { default: Partial<CorsConfigInterface>; [key: string]: Partial<CorsConfigInterface> }) => {
	const list = Object.fromEntries(Object.entries(types).map(entry => [entry[0], buildCorsMiddleware(entry[1])]))

	return (request: ServerRequest, next: (r: ServerRequest) => any, args?: string[]) => {
		return list[args ? args[0] : "default"](request, next)
	}
}

export default buildCompositeCors