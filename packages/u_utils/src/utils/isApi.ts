export default function isApi (request: any) {
	return request && request.headers && (request.headers["accept"] === "application/json" || request.headers["content-type"] === "application/json")
}