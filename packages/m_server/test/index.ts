import Server from "../src"
import { ErrorProvider } from "@acai/utils"
import { route } from "@acai/router"
import request from "../src/tests/utils/request"

async function main () {
	const server = new Server({ port: 3000, hostname: "localhost" })

	server.addProvider(new ErrorProvider)

	route("/", (t) => t)
	route("/hi", () => "hi")

	await server.run()

	const { body } = await request.get("/")
	console.log(body)
}

main()