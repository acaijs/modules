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
const router_1 = require("@acai/router");
const http = require("http");
const RequestHandler_1 = require("../classes/RequestHandler");
const respond_1 = require("../utils/respond");
const error_1 = require("../utils/error");
class Server {
    constructor(config) {
        this._config = {};
        this.routes = [];
        this.providers = [];
        this.middlewares = {};
        this.globals = [];
        this._config = config || {};
        this.server = http.createServer();
    }
    setConfig(config) {
        this._config = Object.assign(Object.assign({}, this._config), config);
    }
    get config() {
        return this._config;
    }
    addProvider(Provider) {
        this.providers.push(new Provider());
    }
    addProviders(Providers) {
        this.providers = [...this.providers, ...Providers.map(Provider => new Provider())];
    }
    getProviders() {
        return this.providers;
    }
    clearProviders() {
        this.middlewares = {};
    }
    addMiddleware(id, cb) {
        this.middlewares[id] = cb;
    }
    addMiddlewares(middlewares) {
        this.middlewares = Object.assign(Object.assign({}, this.middlewares), middlewares);
    }
    getMiddlewares() {
        return this.middlewares;
    }
    clearMiddlewares() {
        this.middlewares = {};
    }
    addGlobal(cb) {
        this.globals.push(cb);
    }
    addGlobals(globals) {
        this.globals = [...this.globals, ...globals];
    }
    getGlobals() {
        return this.globals;
    }
    clearGlobals() {
        this.globals = [];
    }
    run(port, hostname = "0.0.0.0") {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.providers.length; i++) {
                try {
                    const provider = this.providers[i];
                    if (provider.boot)
                        yield provider.boot(this);
                }
                catch (e) {
                    yield error_1.onErrorProvider(this, {}, e);
                }
            }
            this.routes = router_1.route.build();
            this.server.on("request", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const r = new RequestHandler_1.default({ req, res }, this, this.onRequest);
                const flux = yield r.buildBaseRequest(this.routes);
                if (flux) {
                    const curry = yield r.buildPipeline(flux, [...this.globals].reverse(), this.middlewares);
                    yield r.proccess(flux, curry);
                }
                else {
                    respond_1.default(res, {
                        body: "<h1>404 - Not Found</h1>",
                        status: 200,
                    });
                    res.end();
                }
            }));
            this.server.listen(this.config.port || port || 8000, hostname);
            yield new Promise((r) => {
                var _a;
                (_a = this.server) === null || _a === void 0 ? void 0 : _a.on("listening", () => r(true));
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server) {
                this.server.close();
            }
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map