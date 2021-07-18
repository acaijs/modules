// Packages
import { route } from "@acai/router";

// Modules
import Server from "../src/index";

import "./routes";

async function main () {
	route("/", 			() => "hi");
	
	const server = new Server({
		port: 8001,
		hostname: "localhost",
		filePrefix: "src/tests/utils"
	});

	server.addGlobal((r, n) => {
		console.log("global 1");

		return n(r);
	});

	server.addGlobal((r, n) => {
		console.log("global 2");

		return n(r);
	});

	server.addMiddleware("auth", (r, n) => {
		console.log("auth");
		return n(r);
	});
	server.addMiddleware("organization", (r, n) => {
		console.log("organization");
		return n(r);
	});
	server.addMiddleware("member", (r, n) => {
		console.log("member");
		return n(r);
	});
	
	await server.run();
	console.log("server ready");
}

main();