// Packages
import * as http from "http"
import { router, route } from "@acai/router"

// Interfaces
import { AdapterInterface, SerializedAdapterInterface } from "@acai/interfaces"

// Exceptions
import PortOccupied from "../../exceptions/portOccupied"
import RouteNotFound from "../../exceptions/routeNotFound"
import respond from "./utils/respond"
import smartResponse from "./utils/response"

export default class HttpAdapter implements AdapterInterface {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected conn: http.Server;

	// -------------------------------------------------
	// Main methods
	// -------------------------------------------------

	public async boot (config: SerializedAdapterInterface["config"]) {
		const hostname = config.hostname || "localhost"
		const port = config.port || 3000

		this.conn	= http.createServer()

		this.conn.listen(port, hostname)

		this.conn.on("error", (err: Error & {code: string}) => {if (err.code === "EADDRINUSE") throw new PortOccupied(port || 3000)})

		await new Promise(r => void this.conn.on("listening", () => r(true)))

		console.log(`Server running on ${hostname}:${port}`)

		return true
	}

	public async shutdown () {
		if (this.conn.listening) {
			await new Promise(r => this.conn.close(r))
		}
	}

	public async onRequest (cb) {
		this.conn.on("request", async (req, res) => {
			const response = await cb(async onRequest => {
				const [ path ] = this.getPath(req.url || "")
				const match = this.getMatch(path, req)

				if (!match) throw new RouteNotFound(path, req.method || "")

				const request = this.getParsedRequest(req)
				const file = req.method === "OPTIONS" ? () => "" : match.file

				return await onRequest(request, file, match.middlewares)
			})

			const parsedResponse = await smartResponse(response, {req: req as any, res})
			respond(res, parsedResponse)
		})
	}

	// -------------------------------------------------
	// Helper methods
	// -------------------------------------------------

	protected getParsedRequest (req: http.IncomingMessage) {
		const [ path, ...prequery ] = (req.url || "").split("?")
		const query = prequery.join("?").split("&").map(item => item.split("=")).reduce((prev, curr) => ({...prev, [curr[0]]: curr[1]}), {})
		const request = {raw: req, headers: req.headers, method: req.method, status: req.statusCode, url: path, query}

		// prevent raw request to show in any serialization
		Object.defineProperty(request, "raw", { enumerable: false })

		return request
	}

	protected getMatch (path: string, req: http.IncomingMessage) {
		const match = router(path, req.method as any, route.build(false))

		// route not found
		if (!match) return

		const { file, options } = match

		return match ? { file, middlewares: options.middleware || [] } : undefined
	}

	public getPath (prepath: string) {
		const [ path ] = prepath.split("?")

		return path
	}
}