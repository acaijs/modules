"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function respond(res, { body, headers, status }) {
    if (status)
        res.statusCode = status;
    if (headers) {
        Object.keys(headers).forEach((k) => {
            if (k !== "content-length")
                res.setHeader(k, headers[k]);
        });
    }
    if (body)
        res.write(body);
    res.end();
}
exports.default = respond;
//# sourceMappingURL=respond.js.map