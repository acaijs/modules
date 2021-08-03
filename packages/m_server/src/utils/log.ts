export default function logError (text: string, description?: string) {
	console.log(`\x1b[41m Error \x1b[40m ${text}`)
	if (description) console.log(description)
	console.log("")
}