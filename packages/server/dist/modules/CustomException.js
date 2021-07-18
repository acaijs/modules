"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exception extends Error {
    constructor(type, message, data) {
        super(message);
        this.status = 500;
        this.shouldReport = true;
        this._type = type;
        this._data = data;
        this._message = message;
    }
    get message() {
        return this._message;
    }
    get data() {
        return this._data;
    }
    get type() {
        return this._type;
    }
}
exports.default = Exception;
//# sourceMappingURL=CustomException.js.map