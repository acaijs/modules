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
exports.onErrorGeneral = exports.onErrorController = exports.onErrorMiddleware = exports.onErrorProvider = exports.handleException = exports.getStackTrace = void 0;
const log_1 = require("./log");
const response_1 = require("../modules/response");
const getStackTrace = (index = 4, error) => {
    let stack;
    if (error) {
        stack = error.stack;
    }
    else {
        try {
            throw new Error("");
        }
        catch (error) {
            stack = error.stack || "";
        }
    }
    stack = stack.split("\n").map(function (line) { return line.trim(); });
    return stack[index];
};
exports.getStackTrace = getStackTrace;
const handleException = (e, request, context) => {
    if (e.shouldReport === undefined || e.shouldReport === true) {
        if (e.report) {
            e.report(request);
        }
        else {
            if (context)
                context.forEach(i => log_1.default(i[0], i[1]));
        }
    }
    if (e.render) {
        return e.render(request);
    }
    else {
        if (request.headers.accept === "application/json") {
            return response_1.default({
                status: e.status || 500,
                data: { error: "Internal Server Error" },
            });
        }
        else {
            return response_1.default({
                status: e.status || 500,
                data: "<h1>500 - Internal Server Error</h1>",
            });
        }
    }
};
exports.handleException = handleException;
function onErrorProvider(server, request, error) {
    return __awaiter(this, void 0, void 0, function* () {
        return onErrorGeneral("Exception thrown when running provider", server, request, error);
    });
}
exports.onErrorProvider = onErrorProvider;
function onErrorMiddleware(server, request, error) {
    return __awaiter(this, void 0, void 0, function* () {
        return onErrorGeneral("Exception thrown when running middleware", server, request, error);
    });
}
exports.onErrorMiddleware = onErrorMiddleware;
function onErrorController(server, request, error) {
    return __awaiter(this, void 0, void 0, function* () {
        return onErrorGeneral("Exception thrown when running controller", server, request, error);
    });
}
exports.onErrorController = onErrorController;
function onErrorGeneral(type, server, request, error) {
    return __awaiter(this, void 0, void 0, function* () {
        const providers = server.getProviders();
        for (let i = 0; i < providers.length; i++) {
            const provider = providers[i];
            if (provider.onError) {
                const response = yield provider.onError({ error, request, server });
                if (response) {
                    return response;
                }
            }
        }
        const errDescription = `Exception: ${error.message}`;
        const logs = [];
        logs.push([type, `Exception: ${error.message}\n${error.stack}`]);
        if (error.type && error.type === "route")
            logs.push(["Exception thrown when trying to fetch a controller", errDescription]);
        return exports.handleException(error, request, logs);
    });
}
exports.onErrorGeneral = onErrorGeneral;
//# sourceMappingURL=error.js.map