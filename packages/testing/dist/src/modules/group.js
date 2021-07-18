"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Utils
const GroupQueue = require("../utils/group");
const ContextQueue = require("../utils/context");
function group(title, callback) {
    const context = Object.assign({}, ContextQueue.get());
    context.group = [...context.group, title];
    GroupQueue.add({ ctx: context, cb: () => __awaiter(this, void 0, void 0, function* () {
            return callback({
                beforeAll: (cb) => ContextQueue.add({ beforeAll: [cb] }),
                beforeEach: (cb) => ContextQueue.add({ beforeEach: [cb] }),
                afterAll: (cb) => ContextQueue.add({ afterAll: [cb] }),
                afterEach: (cb) => ContextQueue.add({ afterEach: [cb] }),
            });
        }) });
    const extra = {
        tag: (tag) => {
            GroupQueue.append({
                tags: Array.isArray(tag) ? tag : [tag],
            });
            return extra;
        },
    };
    return extra;
}
exports.default = group;
//# sourceMappingURL=group.js.map