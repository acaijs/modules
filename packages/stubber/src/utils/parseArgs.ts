export default function parseArgs (args: string[]) {
	const variables 	= {} as Record<string, string>
	const [stub, name] 	= args

	args.splice(1).forEach(item => {
		const [name, value] = item.split("=")
		variables[name] 	= value || ""
	})

	return {
		stubName: stub,
		stubArgs: {...variables, name},
	}
}