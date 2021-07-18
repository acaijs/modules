"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = exports.set = exports.get = void 0;
let context = {
    group: [],
    tags: [],
    beforeAll: [],
    beforeEach: [],
    afterAll: [],
    afterEach: [],
};
const get = () => context;
exports.get = get;
const set = (ctx) => { context = ctx; };
exports.set = set;
const add = (ctx) => {
    context = {
        group: [...context.group, ...(ctx.group || [])],
        tags: [...context.tags, ...(ctx.tags || [])],
        beforeAll: [...context.beforeAll, ...(ctx.beforeAll || [])],
        beforeEach: [...context.beforeEach, ...(ctx.beforeEach || [])],
        afterAll: [...context.afterAll, ...(ctx.afterAll || [])],
        afterEach: [...context.afterEach, ...(ctx.afterEach || [])],
    };
};
exports.add = add;
//# sourceMappingURL=context.js.map