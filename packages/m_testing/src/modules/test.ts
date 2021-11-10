// Interfaces
import { ExpectAssertionInterface } from "../interfaces/expect"
import ExtraOptionsInterface 	from "../interfaces/extraOptions"

// Utils
import * as Context from "../utils/context"
import * as Queue 	from "../utils/test"

export default function test (title: string, callback: (expect: ExpectAssertionInterface) => Promise<void> | void) {
	const context = Context.get()

	Queue.add({
		...context,
		id: `${context.group.join("/")}/${title}`,
		title,
		callback,
	})

	const extra = {
		tag: (tag: string | string[]) => {
			Queue.append({
				tags: Array.isArray(tag) ? tag: [tag],
			})

			return extra
		},
		timeout: (time: number) => {
			Queue.append({
				timeout: time,
			})

			return extra
		},
	} as ExtraOptionsInterface

	return extra
}