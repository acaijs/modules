const isObject = (item: unknown) => (item && typeof item === "object" && !Array.isArray(item))

export default function deepMerge (obj1: any, obj2: any) {
	const output = Object.assign({}, obj1)
	if (isObject(obj1) && isObject(obj2)) {
		Object.keys(obj2).forEach(key => {
			if (isObject(obj2[key])) {
				if (!(key in obj1))
					Object.assign(output, { [key]: obj2[key] })
				else
					output[key] = deepMerge(obj1[key], obj2[key])
			} else {
				Object.assign(output, { [key]: obj2[key] })
			}
		})
	}
	return output
}
