"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("@acai/config"));
const Hasher_1 = __importDefault(require("../../utils/Hasher"));
const hashType = {
    onCreate: ({ value }) => {
        if (typeof value === "string") {
            const salt = config_1.default ? config_1.default.getConfig("APP_KEY", undefined) : undefined;
            const hash = new Hasher_1.default(undefined, salt || 10);
            hash.hash(value);
            return hash;
        }
        return value;
    },
    onSave: ({ value }) => {
        if (!value)
            return value;
        if (value.toString)
            return value.toString();
        return `${value}`;
    },
    onRetrieve: ({ value }) => {
        return new Hasher_1.default(value);
    },
    onSerialize: ({ value }) => {
        if (value.toString)
            return value.toString();
        return `${value}`;
    },
};
exports.default = hashType;
//# sourceMappingURL=index.js.map