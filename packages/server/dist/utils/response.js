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
const fs = require("fs");
function smartResponse(payload, request, viewPrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {};
        let body = "";
        let status = 200;
        Object.keys(request.req.headers).forEach((k) => {
            if (k !== "content-length")
                headers[k] = request.req.headers[k];
        });
        if (typeof payload === "function" && payload.name === "responseUtility") {
            const data = payload();
            status = data.status || 200;
            body = data.data || "";
            if (data.headers) {
                Object.keys(data.headers).forEach(key => {
                    headers[key] = data.headers[key];
                });
            }
            if (data.view) {
                body = fs.readFileSync(path.join(`${process.cwd()}`, viewPrefix || "", data.view), {
                    encoding: "utf-8"
                });
            }
        }
        else {
            body = payload;
        }
        if (typeof body === "object") {
            headers["Accept"] = "application/json";
            headers["Content-Type"] = "application/json";
            if (body.toObject && typeof body.toObject === "function") {
                body = body.toObject();
            }
        }
        else {
            headers["Accept"] = "text/plain";
            headers["Content-Type"] = "text/plain";
        }
        return { body: typeof body === "object" ? JSON.stringify(body) : body, headers, status };
    });
}
exports.default = smartResponse;
//# sourceMappingURL=response.js.map