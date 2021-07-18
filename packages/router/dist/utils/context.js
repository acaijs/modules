"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMacros = exports.setMacro = exports.getMacro = exports.clearCallbacks = exports.addCallback = exports.getCallbacks = exports.clearRoutes = exports.addRoute = exports.getRoutes = exports.clearContext = exports.setContext = exports.getContext = void 0;
// -------------------------------------------------
// Properties
// -------------------------------------------------
let context = { options: {} };
let routes = [];
let cbs = [];
let macros = {};
// -------------------------------------------------
// Context
// -------------------------------------------------
const getContext = () => context;
exports.getContext = getContext;
const setContext = (_a, lastoptions) => {
    var { options } = _a, newContext = __rest(_a, ["options"]);
    const newoptions = Object.assign({}, lastoptions);
    if (options) {
        Object.keys(options).forEach(key => {
            if (!key.match(/^!/)) {
                if (Array.isArray(options[key]) && Array.isArray(lastoptions[key])) {
                    const arr = options[key];
                    newoptions[key] = [...lastoptions[key].filter(i => !arr.find(x => x === i)), ...arr];
                }
                else if (typeof options[key] === "object" && typeof lastoptions[key] === "object") {
                    newoptions[key] = Object.assign(Object.assign({}, lastoptions[key]), options[key]);
                }
                else {
                    newoptions[key] = options[key];
                }
            }
            else {
                newoptions[key.replace(/^!/, "")] = options[key];
            }
        });
    }
    context = Object.assign(Object.assign({}, newContext), { options: Object.assign({}, newoptions) });
};
exports.setContext = setContext;
const clearContext = () => {
    context = { options: {} };
};
exports.clearContext = clearContext;
// -------------------------------------------------
// Routes
// -------------------------------------------------
const getRoutes = () => routes;
exports.getRoutes = getRoutes;
const addRoute = (view, path, method, options) => {
    // gather data
    const _a = exports.getContext(), { prefix } = _a, _context = __rest(_a, ["prefix"]);
    const completepath = `/${(prefix === undefined ? "/" : prefix) + path}`.replace(/\/$/, "").replace(/^(\\+|\/+)/gm, "/");
    const clearview = typeof view === "string" ? view
        .replace(/(\\+|\/+)/gm, "/")
        .replace(/(\\|\/)$/gm, "")
        .replace(/^(\\|\/)/gm, "") : view;
    // push to routes
    routes.push({
        file: clearview,
        path: completepath,
        method,
        options: Object.assign(Object.assign({}, _context.options), options),
    });
    const index = routes.length - 1;
    return {
        options: (newoptions) => {
            routes[index].options = Object.assign(Object.assign({}, routes[index].options), newoptions);
        }
    };
};
exports.addRoute = addRoute;
const clearRoutes = () => {
    routes = [];
};
exports.clearRoutes = clearRoutes;
// -------------------------------------------------
// Context
// -------------------------------------------------
const getCallbacks = () => cbs;
exports.getCallbacks = getCallbacks;
const addCallback = (newCallback) => {
    cbs.push(newCallback);
};
exports.addCallback = addCallback;
const clearCallbacks = () => {
    cbs = [];
};
exports.clearCallbacks = clearCallbacks;
// -------------------------------------------------
// Macros
// -------------------------------------------------
const getMacro = (name) => {
    if (!macros[name]) {
        throw new Error(`Macro '${name}' not found`);
    }
    return macros[name];
};
exports.getMacro = getMacro;
const setMacro = (name, callback) => {
    macros[name] = callback;
};
exports.setMacro = setMacro;
const clearMacros = () => macros = {};
exports.clearMacros = clearMacros;
//# sourceMappingURL=context.js.map