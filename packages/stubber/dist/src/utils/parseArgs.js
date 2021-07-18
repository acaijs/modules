"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseArgs(args) {
    const variables = {};
    const [stub, name] = args;
    args.splice(1).forEach(item => {
        const [name, value] = item.split("=");
        variables[name] = value || "";
    });
    return {
        stubName: stub,
        stubArgs: Object.assign(Object.assign({}, variables), { name }),
    };
}
exports.default = parseArgs;
//# sourceMappingURL=parseArgs.js.map