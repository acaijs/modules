"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(options) {
    const preparedoptions = options || {};
    function responseUtility() {
        return preparedoptions;
    }
    responseUtility.headers = (append) => { preparedoptions.headers = append; return responseUtility; };
    responseUtility.view = (name) => { preparedoptions.view = name; return responseUtility; };
    responseUtility.status = (status) => { preparedoptions.status = status; return responseUtility; };
    responseUtility.data = (data) => { preparedoptions.data = data; return responseUtility; };
    responseUtility.json = (json) => { preparedoptions.json = json; return responseUtility; };
    return responseUtility;
}
exports.default = response;
//# sourceMappingURL=response.js.map