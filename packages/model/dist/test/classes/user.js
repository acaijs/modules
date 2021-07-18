"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const comment_1 = __importDefault(require("./comment"));
let User = class User extends index_1.Model {
};
__decorate([
    index_1.Field("uuid")
], User.prototype, "id", void 0);
__decorate([
    index_1.Field("string")
], User.prototype, "name", void 0);
__decorate([
    index_1.Field("int")
], User.prototype, "age", void 0);
__decorate([
    index_1.Field.hasMany(() => comment_1.default, "id_user")
], User.prototype, "comments", void 0);
User = __decorate([
    index_1.Table("data_user")
], User);
exports.default = User;
//# sourceMappingURL=user.js.map