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
const path = require("path");
const router_1 = require("@acai/router");
const Cookies = require("cookies");
const response_1 = require("../modules/response");
const response_2 = require("../utils/response");
const controller_1 = require("../utils/controller");
const errorHandling = require("../utils/error");
const respond_1 = require("../utils/respond");
class RequestHandler {
    constructor(req, server, onRequest) {
        this.serverRequest = req;
        this.server = server;
        this.onRequest = onRequest;
    }
    buildBaseRequest(routes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProperties(this.serverRequest, routes);
        });
    }
    buildPipeline(request, globals, middlewares) {
        const middlewaresToRun = [...(request.options.middleware || [])].reverse();
        let curry;
        if (request.httpMethod === "OPTIONS") {
            curry = (r) => __awaiter(this, void 0, void 0, function* () { return [response_1.default().status(204).data(""), r]; });
        }
        else {
            curry = (fluxRequest) => __awaiter(this, void 0, void 0, function* () {
                const [name, method] = [request.controller, request.method];
                const pathString = typeof name === "string" ? path.join(`${process.cwd()}`, this.server.config.filePrefix || "", name) : name;
                return controller_1.default(pathString, method, fluxRequest)
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    return [(typeof response === "function" ? (yield response(fluxRequest)) : response), fluxRequest];
                }))
                    .catch((error) => __awaiter(this, void 0, void 0, function* () {
                    return [yield errorHandling.onErrorController(this.server, fluxRequest, error), fluxRequest];
                }));
            });
        }
        for (let i = 0; i < middlewaresToRun.length; i++) {
            const name = middlewaresToRun[i];
            const [middleware, options] = name.split(":");
            const lastcurry = curry;
            curry = (fluxRequest) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield middlewares[middleware](fluxRequest, lastcurry, (options || "").split(","));
                }
                catch (e) {
                    return yield errorHandling.onErrorMiddleware(this.server, fluxRequest, e);
                }
            });
        }
        for (let i = 0; i < globals.length; i++) {
            const middleware = globals[i];
            const lastcurry = curry;
            curry = (request) => __awaiter(this, void 0, void 0, function* () { return yield middleware(request, lastcurry); });
            curry = (fluxRequest) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield middleware(fluxRequest, lastcurry);
                }
                catch (e) {
                    return yield errorHandling.onErrorMiddleware(this.server, fluxRequest, e);
                }
            });
        }
        return curry;
    }
    proccess(request, curry) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastresponseraw = yield curry(request);
            const lastresponse = Array.isArray(lastresponseraw) ? lastresponseraw : [lastresponseraw, request];
            const responseData = yield response_2.default(lastresponse[0], this.serverRequest, this.server.config.viewPrefix);
            respond_1.default(this.serverRequest.res, Object.assign(Object.assign(Object.assign({}, (lastresponse[1] || {})), (responseData || {})), { headers: Object.assign(Object.assign({}, (lastresponse[1] || { headers: {} }).headers), (responseData.headers || {})) }));
        });
    }
    getProperties({ req: request, res }, routes) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.onRequest)
                return yield this.onRequest(request.url, request.method);
            const [url, params] = (_a = request.url) === null || _a === void 0 ? void 0 : _a.split("?");
            const match = router_1.router(url, request.method, routes);
            if (!match)
                return;
            const query = {};
            if (params) {
                const prequery = (params || "").split("&").map(i => i.split("="));
                for (let i = 0; i < prequery.length; i++) {
                    const [_key, value] = prequery[i];
                    const key = decodeURI(_key);
                    if (!value) {
                        query[key] = true;
                    }
                    else if (!value.match(/\D+/)) {
                        query[key] = parseFloat(value);
                    }
                    else {
                        query[key] = decodeURI(value);
                    }
                }
            }
            const key = this.server.config.key;
            const response = {
                headers: request.headers,
                route: match.path,
                controller: typeof match.file === "string" ? match.file.split("@")[0] : match.file,
                method: typeof match.file === "string" ? match.file.split("@")[1] : undefined,
                options: match.options,
                params: match.variables,
                query: query,
                fields: {},
                files: {},
                cookies: new Cookies(request, res, key ? { keys: [key] } : undefined),
                httpMethod: request.method,
                raw: request,
            };
            return response;
        });
    }
}
exports.default = RequestHandler;
//# sourceMappingURL=RequestHandler.js.map