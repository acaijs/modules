// Interface
import ContextInterface 		from "../interfaces/context";
import GroupAuxiliaryInterface 	from "../interfaces/groupAuxiliary";

type GroupsInterface = {ctx: ContextInterface, cb: (aux: GroupAuxiliaryInterface) => void};

let groups: GroupsInterface[] = [];

export const get = () => groups;

export const append = (ctx: Partial<ContextInterface>) => {
	const lastctx = groups[groups.length - 1].ctx;

	groups[groups.length - 1].ctx = {
		...groups[groups.length - 1].ctx,
		...ctx,

		group	: [...lastctx.group	, ...(ctx.group || [])],
		tags	: [...lastctx.tags	, ...(ctx.tags || [])],

		// callbacks
		beforeAll	: [...lastctx.beforeAll	, ...(ctx.beforeAll || [])],
		beforeEach	: [...lastctx.beforeEach, ...(ctx.beforeEach || [])],
		afterAll	: [...lastctx.afterAll	, ...(ctx.afterAll || [])],
		afterEach	: [...lastctx.afterEach	, ...(ctx.afterEach || [])],
	};
}
export const add = (test: GroupsInterface) => {
	groups.push(test);
}
export const clear = () => {
	groups = [];
}
