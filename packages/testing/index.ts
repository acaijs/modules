const tsnode = require("ts-node")
const { test } = require("./src/index")

const t = tsnode.create({  })

function requireFromString (src, filename) {
	const m = new (module as any).constructor()
	m.paths = module.paths
	m._compile(src, filename)
	return m.exports
}

function parseTs (src, filename) {
	const parsed = t.compile(src, filename)
	return requireFromString(parsed, filename)
}

const content = `
import { test } from "./src"

test("hi", () => {})
`
parseTs(content, "./test.ts")

console.log(test.export())