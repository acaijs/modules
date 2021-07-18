"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomException_1 = require("../../modules/CustomException");
class Exception extends CustomException_1.default {
    constructor(message) {
        super("test", message);
        this.status = 200;
        this.shouldReport = false;
    }
    render() {
        return this.message;
    }
}
exports.default = Exception;
//# sourceMappingURL=exception.js.map