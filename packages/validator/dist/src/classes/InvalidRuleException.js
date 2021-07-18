"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const server_1 = require("@acai/server");
class InvalidRuleException extends server_1.CustomException {
    constructor(message, data) {
        super("invalidValidationRule", message, data);
        this.shouldReport = true;
    }
    report() {
        console.log(this.message);
    }
}
exports.default = InvalidRuleException;
//# sourceMappingURL=InvalidRuleException.js.map