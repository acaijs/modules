// Interfaces
import { ServerResponse }		from "http"
import { ResponseInterface }	from "@acai/interfaces"

export default function respond (res: ServerResponse, { body, headers, status }: ResponseInterface) {
	// Status
	if (status)	res.statusCode = status

	// Set headers
	if (headers) {
		Object.keys(headers).forEach((k) => {
			if (k !== "content-length")
				res.setHeader(k, headers[k] as string)
		})
	}

	// Set body
	if (body) res.write(body)

	// respond to server
	res.end()
}