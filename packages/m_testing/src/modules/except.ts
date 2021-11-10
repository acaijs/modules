// Interfaces
import { ExpectAssertionInterface } from "../interfaces/expect"

// Utils
import * as Context from "../utils/context"
import * as Queue 	from "../utils/test"

export default function except (title: string, callback: (_: ExpectAssertionInterface) => Promise<void> | void) {
	const context = Context.get()

	Queue.add({
		...context,
		id: `${context.group.join("/")}/${title}`,
		title,
		except: true,
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
	}

	return extra
}