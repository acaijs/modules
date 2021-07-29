// Interfaces
import ContextInterface from "../interfaces/context";

let context: ContextInterface = {
	group		: [],

	tags: [],

	beforeAll	:[],
	beforeEach	:[],
	afterAll	:[],
	afterEach	:[],
};

export const get = () => context;
export const set = (ctx: ContextInterface) => { context = ctx; }
export const add = (ctx: Partial<ContextInterface>) => {
	context = {
		group		: [...context.group			, ...(ctx.group || [])],

		tags		: [...context.tags			, ...(ctx.tags || [])],

		beforeAll	: [...context.beforeAll		, ...(ctx.beforeAll 	|| [])],
		beforeEach	: [...context.beforeEach	, ...(ctx.beforeEach 	|| [])],
		afterAll	: [...context.afterAll		, ...(ctx.afterAll 		|| [])],
		afterEach	: [...context.afterEach		, ...(ctx.afterEach 	|| [])],
	};
}