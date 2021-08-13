import Server from "../src"

async function main () {
	const server = new Server()

	const adapter = {
		boot: () => { console.log("Server booted"); return true },
		onRequest: () => console.log("Request made"),
		onParse: () => console.log("Parse request"),
	}

	server.addAdapter("test", adapter)

	await server.run()
}

main()