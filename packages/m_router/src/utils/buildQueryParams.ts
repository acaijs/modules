function stringToType (str: string) {
	if (str === "true") return true
	if (str === "false") return false
	if (`${parseFloat(str)}` === str) return parseFloat(str)

	return str
}

export default function buildQueryParams (prepath = "") {
	const [path, ...preargs] = prepath.split("?")
	const listargs = [...(new URLSearchParams(preargs.join("?")).entries())]
	const args = {} as Record<string, number | string | boolean>

	listargs.forEach(arg => args[arg[0]] = stringToType(arg[1]) || true)

	return [path, args] as const
}