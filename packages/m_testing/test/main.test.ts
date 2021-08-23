import test from "../index"

test("test exception", (a) => {
	const n = () => new Promise(() => setTimeout(() => { throw new Error("test") }, 100))
	a(n).toThrow({})
})