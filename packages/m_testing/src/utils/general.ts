export const getStackTrace = (index = 4, prestack?) => {
	let stack = prestack?.stack

	if (!stack) {
		try {
			throw new Error("")
		}
		catch (error) {
			stack = (error as any).stack || ""
		}
	}

	return stack.split("\n").slice(index).join("\n")
}

export const isArrayEquals = (arr1: string[], arr2: string[]) => {
	if (arr1.length !== arr2.length) return false

	return arr1.filter((item, index) => item !== arr2[index]).length === 0
}

export const repeatString = (text: string, times: number) => {
	let response = ""

	for (let i = 0; i < times; i++) {
		response += text
	}

	return response
}