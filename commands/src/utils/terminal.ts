// Packages
import { exec } from "child_process"

const colors = {
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
}

export const cli = (command: string) => {
	return new Promise((resolve, reject) =>
		exec(command, (error, stdout, sterr) =>
			error || sterr ? reject(error || sterr) : resolve(stdout),
		),
	)
}

export const colored = (message: string, color) => {
	console.log(colors[color || "white"] + message + "\x1b[0m")
}

export const exception = (message) => {
	colored(message, "red")
	process.exit(1)
}