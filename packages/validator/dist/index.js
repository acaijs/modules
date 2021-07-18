"use strict";
/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRules = exports.setRules = exports.setRule = exports.rules = void 0;
const validator_1 = require("./src/modules/validator");
exports.default = validator_1.default;
// rules export
var index_1 = require("./src/rules/index");
Object.defineProperty(exports, "rules", { enumerable: true, get: function () { return index_1.default; } });
var index_2 = require("./src/rules/index");
Object.defineProperty(exports, "setRule", { enumerable: true, get: function () { return index_2.setRule; } });
var index_3 = require("./src/rules/index");
Object.defineProperty(exports, "setRules", { enumerable: true, get: function () { return index_3.setRules; } });
var index_4 = require("./src/rules/index");
Object.defineProperty(exports, "clearRules", { enumerable: true, get: function () { return index_4.clearRules; } });
//# sourceMappingURL=index.js.map