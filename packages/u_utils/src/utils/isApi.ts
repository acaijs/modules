// Packages
import { RequestInterface } from "@acai/interfaces"

export default function isApi (request: RequestInterface) {
	return request.headers && (request.headers["accept"] === "application/json" || request.headers["content-type"] === "application/json")
}