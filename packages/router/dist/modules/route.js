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
const context_1 = require("../utils/context");
const context_2 = require("../utils/context");
const context_3 = require("../utils/context");
const context_4 = require("../utils/context");
// -------------------------------------------------
// HTTP Methods
// -------------------------------------------------
const routeAnyMethod = (path, filePath, options = {}) => {
    return context_1.addRoute(filePath, path, "ANY", options);
};
const routeGetMethod = (path, filePath, options = {}) => {
    return context_1.addRoute(filePath, path, "GET", options);
};
const routePostMethod = (path, filePath, options = {}) => {
    return context_1.addRoute(filePath, path, "POST", options);
};
const routePatchMethod = (path, filePath, options = {}) => {
    return context_1.addRoute(filePath, path, "PATCH", options);
};
const routePutMethod = (path, filePath, options = {}) => {
    return context_1.addRoute(filePath, path, "PUT", options);
};
const routeDeleteMethod = (path, filePath, options = {}) => {
    return context_1.addRoute(filePath, path, "DELETE", options);
};
// -------------------------------------------------
// Helpers
// -------------------------------------------------
const routeMacro = (name, callback) => {
    context_4.setMacro(name, callback);
};
const routeUseMacro = (name, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    const callback = context_1.getMacro(name);
    yield callback(...args);
});
const routeOptions = (options, callback) => {
    const c = Object.assign(Object.assign({}, context_3.getContext()), { options: Object.assign({}, options) });
    const lastoptions = Object.assign({}, context_3.getContext().options);
    context_2.addCallback(() => {
        context_3.setContext(c, lastoptions);
        callback();
    });
};
const routeMany = (method, path, filePath, options = {}) => {
    if (method.includes("GET"))
        routeGetMethod(path, filePath, options);
    if (method.includes("PUT"))
        routePutMethod(path, filePath, options);
    if (method.includes("POST"))
        routePostMethod(path, filePath, options);
    if (method.includes("PATCH"))
        routePatchMethod(path, filePath, options);
    if (method.includes("DELETE"))
        routeDeleteMethod(path, filePath, options);
};
const routeGroup = (prefix, callback, options) => {
    const cprefix = (context_3.getContext().prefix === undefined ? "" : context_3.getContext().prefix) + (prefix || "");
    const c = Object.assign(Object.assign(Object.assign({}, context_3.getContext()), options), { prefix: cprefix });
    const lastoptions = Object.assign({}, context_3.getContext().options);
    context_2.addCallback(() => {
        context_3.setContext(c, lastoptions);
        callback();
    });
};
const routeBuild = (clearCache = true) => {
    let cbs = context_2.getCallbacks();
    while (cbs.length > 0) {
        context_2.clearCallbacks();
        // run all groups
        for (let i = 0; i < cbs.length; i += 1) {
            cbs[i]();
        }
        // break loop if no callbacks left
        cbs = context_2.getCallbacks();
    }
    // build components
    const routes = context_1.getRoutes();
    // clear registered routes
    if (clearCache)
        context_1.clearRoutes();
    // filter repeated routes
    const filteredroutes = [];
    routes.reverse().forEach(i => { if (!filteredroutes.find(x => x.path === i.path && x.method === i.method))
        filteredroutes.push(i); });
    return filteredroutes.reverse();
};
const clearMethod = () => {
    context_1.clearRoutes();
    context_3.clearContext();
};
// -------------------------------------------------
// Add default macro
// -------------------------------------------------
routeMacro("resource", (name, file) => {
    routeGetMethod(`${name}`, `${file}@index`);
    routePostMethod(`${name}`, `${file}@store`);
    routeGroup("/{id}", () => {
        routeGetMethod("/", `${file}@show`);
        routePatchMethod("/", `${file}@update`);
        routePutMethod("/", `${file}@update`);
        routeDeleteMethod("/", `${file}@destroy`);
    });
});
// -------------------------------------------------
// Exports
// -------------------------------------------------
const route = routeAnyMethod;
route.any = routeAnyMethod;
route.get = routeGetMethod;
route.post = routePostMethod;
route.put = routePutMethod;
route.patch = routePatchMethod;
route.delete = routeDeleteMethod;
route.options = routeOptions;
route.group = routeGroup;
route.many = routeMany;
route.build = routeBuild;
route.clear = clearMethod;
route.macro = routeMacro;
route.use = routeUseMacro;
exports.default = route;
//# sourceMappingURL=route.js.map