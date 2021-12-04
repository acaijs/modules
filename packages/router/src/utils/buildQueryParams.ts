function stringToType (str: string) {
	if (str === "true") return true
	if (str === "false") return false
	if (`${parseFloat(str)}` === str) return parseFloat(str)

	return str
}

export default function buildQueryParams (prepath = "") {
	const [path, ...preargs] = prepath.split("?")
	const args = {} as Record<string, number | string | boolean>

	(new URLSearchParams(preargs.join("?"))).forEach((val, key) => args[key] = stringToType(val) || true)

	return [path, args] as const
}