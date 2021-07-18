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
// Packages
const glob = require("glob");
const path = require("path");
const findMethod = (regex) => __awaiter(void 0, void 0, void 0, function* () {
    const files = glob.sync(regex || "./**/*.{test,tests}.{ts,js}", {
        cwd: process.cwd(),
        nodir: true,
        ignore: ["./node_modules/**/*"],
    });
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () { return yield Promise.resolve().then(() => require(path.join(process.cwd(), file))); }));
});
exports.default = findMethod;
//# sourceMappingURL=find.js.map