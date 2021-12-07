// Interfaces
import ModelContent 		from "../../../../interfaces/ModelContent"
import QueryPart 			from "../../../../interfaces/QueryPart"

function valueType (value: unknown) {
	if (value === null || value === undefined)
		return ""
	if (Array.isArray(value))
		return " (?)"

	return " ?"
}

export default function resolveQueryPart (queryBuild: QueryPart) {
	const values = [] as unknown[]
	const parts = queryBuild.logic.map((item) => {
		const subparts = (item as QueryPart).logic.map((subitem) => {
			if ((subitem as QueryPart).type) {
				return `(${resolveQueryPart(subitem as QueryPart)})`
			}

			const arrayitem = subitem as [string, string, ModelContent]
			if (arrayitem[2] !== null && arrayitem[2] !== undefined) values.push(arrayitem[2])
			return `${arrayitem[0]} ${arrayitem[1]}${valueType(arrayitem[2])}`
		})

		return subparts.join(` ${(item as QueryPart).type === "and" ? "AND":"OR"} `)
	}) as string[]

	return [parts.join(` ${queryBuild.type === "and" ? "AND":"OR"} `), values] as [string, (string | number | boolean | any)[]]
}