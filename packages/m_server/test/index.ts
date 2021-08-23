import Server from "../src"
import { ErrorProvider } from "@acai/utils"
import { route } from "@acai/router"

async function main () {
	const server = new Server({ port: 3000, hostname: "localhost" })

	server.addProvider(new ErrorProvider)

	route.post("/", (t) => t)
	route("/hi", () => "hi")

	await server.run()
}

main()