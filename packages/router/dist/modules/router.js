"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * # Router
 *
 * Get a list of routes and find the correspondent based on the given routes.
 *
 * @param {string} path current url path to be analyzed against all routes
 * @param {string} method HTTP method to match to
 * @param {RouteInterface[]} routes list of available routes that can be matched
 * @param {RouterConfigInterface?} config extra config options to customize the router behaviour
 */
const routerModule = (path, method, routes, config) => {
    // prepare data
    const sanitizedpath = path.replace(/(\\|\/)^/, "");
    const variablematch = new RegExp(`${(config === null || config === void 0 ? void 0 : config.variableEnclose) || "{"}\\s*\\S+\\??\\s*${(config === null || config === void 0 ? void 0 : config.variableEnclose) || "}"}`);
    const optionalVariableMatch = new RegExp(`\\?{1}\\s*${(config === null || config === void 0 ? void 0 : config.variableEnclose) || "}"}`);
    let variables = {};
    // Match routes
    const route = routes.find((route) => {
        variables = {};
        const splitpath = route.path.split("/").filter(i => i !== "");
        const possibleMatch = sanitizedpath.split("/").filter(i => i !== "");
        // check route http method
        if (method !== route.method && !(method === "OPTIONS") && route.method !== "ANY")
            return false;
        // check by length
        if (possibleMatch.length > splitpath.length && splitpath[splitpath.length - 1] !== "*") {
            return false;
        }
        // filter by the actual route
        const matches = splitpath.filter((part, index) => {
            const isVar = variablematch.test(part);
            const isOptionalVar = optionalVariableMatch.test(part);
            const varName = part.replace(new RegExp(`${(config === null || config === void 0 ? void 0 : config.variableEnclose) || "{"}\\s*`), "").replace(new RegExp(`\\??\\s*${(config === null || config === void 0 ? void 0 : config.variableEnclose) || "}"}`), "");
            if (isVar) {
                if (possibleMatch[index]) {
                    variables[varName] = possibleMatch[index];
                }
                if (isOptionalVar) {
                    return false;
                }
                else {
                    return !possibleMatch[index];
                }
            }
            else {
                return part !== possibleMatch[index];
            }
        }).length;
        // add extra if necessary
        if (!matches && splitpath[splitpath.length - 1] === "*" && possibleMatch.length > splitpath.length) {
            variables["*"] = possibleMatch.splice(0, splitpath.length);
        }
        return !matches;
    });
    if (route)
        return Object.assign(Object.assign({}, route), { options: route.options, variables });
};
exports.default = routerModule;
//# sourceMappingURL=router.js.map