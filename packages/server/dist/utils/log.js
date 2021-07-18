"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logError(text, description) {
    console.log(`\x1b[41m Error \x1b[40m ${text}`);
    if (description)
        console.log(description);
    console.log("");
}
exports.default = logError;
//# sourceMappingURL=log.js.map