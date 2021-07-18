"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function queryResolver(client, queryString, params = []) {
    return new Promise((resolve, reject) => {
        client.query(queryString, params, (error, results) => {
            if (error)
                reject(error);
            resolve(results);
        });
    });
}
exports.default = queryResolver;
//# sourceMappingURL=queryResolver.js.map