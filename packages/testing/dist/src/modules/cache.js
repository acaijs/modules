"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Utils
const run_1 = require("./run");
function cache(arg1, arg2) {
    if (!run_1.getCurr())
        throw new Error("Trying to use cache outside of a test context");
    run_1.getCurr().messages = [...(run_1.getCurr().messages || []), [arg2 ? arg2 : arg1, arg2 ? arg1 : undefined]];
}
exports.default = cache;
//# sourceMappingURL=cache.js.map