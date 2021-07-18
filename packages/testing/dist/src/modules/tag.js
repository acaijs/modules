"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Interfaces
const ContextQueue = require("../utils/context");
const GroupQueue = require("../utils/group");
function tag(tag, callback) {
    const context = ContextQueue.get();
    GroupQueue.add({
        ctx: Object.assign(Object.assign({}, context), { tags: Array.isArray(tag) ? tag : [tag] }),
        cb: callback,
    });
    callback();
}
exports.default = tag;
//# sourceMappingURL=tag.js.map