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
const fs = require("fs");
const file_1 = require("./file");
function findController(controller, method, request) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof controller !== "string") {
            return controller;
        }
        const pathString = file_1.default(controller) || controller;
        if (!fs.existsSync(pathString)) {
            const e = new Error(`Controller ${pathString.split(/(\\|\/)/).reverse()[0].split("@")[0]} for route ${request.route} not found`);
            e.type = "route";
            throw e;
        }
        const file = (yield Promise.resolve().then(() => require(pathString))).default;
        if (((_a = file.prototype) === null || _a === void 0 ? void 0 : _a.constructor) && typeof ((_b = file.prototype) === null || _b === void 0 ? void 0 : _b.constructor) === "function") {
            const instance = new file(request);
            if (method) {
                if (instance[method])
                    return instance[method].bind(instance);
                else {
                    const e = new Error(`Controller ${pathString.split(/(\\|\/)/).reverse()[0].split("@")[0]} for route ${request.route} does not contain method ${method}`);
                    e.type = "route";
                    throw e;
                }
            }
            return instance;
        }
        else if (method) {
            return file[method];
        }
        else {
            return file;
        }
    });
}
exports.default = findController;
//# sourceMappingURL=controller.js.map