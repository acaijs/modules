// Interfaces
import * as ContextQueue 	from "../utils/context";
import * as GroupQueue 		from "../utils/group";

export default function tag (tag: string | string[], callback: () => void) {
	const context = ContextQueue.get();

	GroupQueue.add({
		ctx: {
			...context,
			tags: Array.isArray(tag) ? tag : [tag],
		},
		cb: callback,
	});

	callback();
}