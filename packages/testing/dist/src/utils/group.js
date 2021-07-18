"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.add = exports.append = exports.get = void 0;
let groups = [];
const get = () => groups;
exports.get = get;
const append = (ctx) => {
    const lastctx = groups[groups.length - 1].ctx;
    groups[groups.length - 1].ctx = Object.assign(Object.assign(Object.assign({}, groups[groups.length - 1].ctx), ctx), { group: [...lastctx.group, ...(ctx.group || [])], tags: [...lastctx.tags, ...(ctx.tags || [])], 
        // callbacks
        beforeAll: [...lastctx.beforeAll, ...(ctx.beforeAll || [])], beforeEach: [...lastctx.beforeEach, ...(ctx.beforeEach || [])], afterAll: [...lastctx.afterAll, ...(ctx.afterAll || [])], afterEach: [...lastctx.afterEach, ...(ctx.afterEach || [])] });
};
exports.append = append;
const add = (test) => {
    groups.push(test);
};
exports.add = add;
const clear = () => {
    groups = [];
};
exports.clear = clear;
//# sourceMappingURL=group.js.map