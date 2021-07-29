// Interfaces
import GroupAuxiliaryInterface 	from "../interfaces/groupAuxiliary";
import ExtraOptionsInterface 	from "../interfaces/extraOptions";

// Utils
import * as GroupQueue 		from "../utils/group";
import * as ContextQueue 	from "../utils/context";

export default function group (title: string, callback: (group: GroupAuxiliaryInterface) => void) {
	const context = {...ContextQueue.get()};

	context.group = [...context.group, title];

	GroupQueue.add({ctx: context, cb: async () => callback({
		beforeAll	: (cb) => ContextQueue.add({beforeAll:[cb]}),
		beforeEach	: (cb) => ContextQueue.add({beforeEach:[cb]}),
		afterAll	: (cb) => ContextQueue.add({afterAll:[cb]}),
		afterEach	: (cb) => ContextQueue.add({afterEach:[cb]}),
	})});

	const extra = {
		tag: (tag: string | string[]) => {
			GroupQueue.append({
				tags: Array.isArray(tag) ? tag: [tag],
			});

			return extra;
		},
	} as ExtraOptionsInterface;

	return extra;
}