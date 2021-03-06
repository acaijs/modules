export default function simpleStringify (object) {
	if (object && typeof object === "object") {
		object = copyWithoutCircularReferences([object], object)
	}
	return object

	function copyWithoutCircularReferences(references, object) {
		const cleanObject = {}
		Object.keys(object).forEach(function(key) {
			const value = object[key]
			if (value && Array.isArray(value)) {
				cleanObject[key] = value
			}
			else if (value && typeof value === "object") {
				if (references.indexOf(value) < 0) {
					references.push(value)
					cleanObject[key] = copyWithoutCircularReferences(references, value)
					references.pop()
				} else {
					cleanObject[key] = "###_Circular_###"
				}
			} else if (typeof value !== "function") {
				cleanObject[key] = value
			}
		})
		return cleanObject
	}
}