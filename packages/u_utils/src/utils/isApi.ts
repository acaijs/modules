// Packages
import { Request } from "@acai/server"

export default function isApi (request: Request) {
	return request.headers && (request.headers["accept"] === "application/json" || request.headers["content-type"] === "application/json")
}