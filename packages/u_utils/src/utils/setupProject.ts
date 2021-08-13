import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"

function getEnv () {
	if (fs.existsSync(path.join(process.cwd(), ".env.example"))) {
		return fs.readFileSync(path.join(process.cwd(), ".env.example"), { encoding: "utf-8" })
	}

	return "APP_KEY=\n\nDATABASE=mysql\nDATABASE_USERNAME=root\nDATABASE_PASSWORD=\nDATABASE_NAME=acai_project\nDATABASE_PORT=3306"
}

// check if env is setup correctly
if (!fs.existsSync(path.join(process.cwd(), ".env"))) {
	let content = getEnv()

	// inject app key
	if (!content.match(/APP_KEY=.+\n/)) {
		const token = crypto.randomBytes(32).toString("base64")
		content = content.replace(/APP_KEY=\n/, `APP_KEY=${token}\n`)
	}

	// save env
	fs.writeFileSync(path.join(process.cwd(), ".env"), content, { encoding: "utf-8" })

	console.log("env file created")
}