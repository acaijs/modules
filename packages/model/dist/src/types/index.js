"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = exports.get = exports.add = exports.clear = void 0;
const index_1 = __importDefault(require("./string/index"));
const int_1 = __importDefault(require("./int"));
const date_1 = __importDefault(require("./date"));
const boolean_1 = __importDefault(require("./boolean"));
const float_1 = __importDefault(require("./float"));
const hash_1 = __importDefault(require("./hash"));
const sid_1 = __importDefault(require("./sid"));
const uuid_1 = __importDefault(require("./uuid"));
const bigInt_1 = __importDefault(require("./bigInt"));
const datetime_1 = __importDefault(require("./datetime"));
const id_1 = __importDefault(require("./id"));
const json_1 = __importDefault(require("./json"));
const smallInt_1 = __importDefault(require("./smallInt"));
const text_1 = __importDefault(require("./text"));
const time_1 = __importDefault(require("./time"));
const timestamp_1 = __importDefault(require("./timestamp"));
let typesList = {
    "bigint": bigInt_1.default,
    "boolean": boolean_1.default,
    "date": date_1.default,
    "datetime": datetime_1.default,
    "float": float_1.default,
    "hash": hash_1.default,
    "id": id_1.default,
    "int": int_1.default,
    "json": json_1.default,
    "sid": sid_1.default,
    "smallint": smallInt_1.default,
    "string": index_1.default,
    "text": text_1.default,
    "time": time_1.default,
    "timestamp": timestamp_1.default,
    "uuid": uuid_1.default,
};
const clear = () => typesList = {};
exports.clear = clear;
const add = (name, modelType) => typesList[name] = modelType;
exports.add = add;
const get = (name) => typesList[name];
exports.get = get;
const all = () => typesList;
exports.all = all;
exports.default = {
    clear: exports.clear,
    add: exports.add,
    get: exports.get,
    all: exports.all,
};
//# sourceMappingURL=index.js.map