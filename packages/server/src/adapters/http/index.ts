// Packages
import * as http from "http"
import { router, route } from "@acai/router"

// Interfaces
import { AdapterInterface, SerializedAdapterInterface } from "@acai/interfaces"

// Exceptions
import PortOccupied from "../../exceptions/portOccupied"
import RouteNotFound from "../../exceptions/routeNotFound"

// Utils
import respond from "../../utils/respond"
import smartResponse from "../../utils/response"
import Cookies from "cookies"

export default class HttpAdapter implements AdapterInterface {
	// -------------------------------------------------
	// Properties
	// -------------------------------------------------

	protected conn: http.Server

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

		if (process.env.testing !== "true")
			console.log(`Server running on ${hostname}:${port}`)

		return true
	}

	public async shutdown () {
		if (this.conn.listening) {
			await new Promise(r => this.conn.close(r))
		}
	}

	public onRequest: AdapterInterface["onRequest"] = async (makeRequest, requestSafeThread) => {
		this.conn.on("request", async (req, res) => {
			const response = await requestSafeThread(async () => {
				const url = req.url || ""
				const match = this.getMatch(url || "", req)

				if (!match) throw new RouteNotFound(url.split("?")[0], req.method || "")

				const request = {...match, ...this.getParsedRequest(req, res)}
				const file = req.method === "OPTIONS" ? () => "" : match.controller

				return await makeRequest(request, file, match.middlewares)
			})

			const parsedResponse = await smartResponse(response, req as any)
			respond(res, parsedResponse)
		})
	}

	// -------------------------------------------------
	// Helper methods
	// -------------------------------------------------

	protected getParsedRequest (req: http.IncomingMessage, res: http.ServerResponse) {
		const [ path ] = (req.url || "").split("?")
		const headers = Object.keys(req.headers).reduce((prev, curr) => ({...prev, [curr.toLowerCase()]: req.headers[curr]}), {})

		// gather all data
		const request = {
			raw: () => req,
			headers,
			method: req.method!,
			status: req.statusCode,
			url: path, body: {},
			cookies: new Cookies(req, res, undefined),
		}

		return request
	}

	protected getMatch (path: string, req: http.IncomingMessage) {
		const match = router(path, req.method as any, route.build(false))

		// route not found
		if (!match) return

		const { file, options, variables, query } = match

		return match ? {
			controller: file,
			middlewares: (options.middleware || []) as string[],
			params: variables as Record<string, string>,
			query,
		} : undefined
	}

	public getPath (prepath: string) {
		const [ path ] = prepath.split("?")

		return path
	}
}