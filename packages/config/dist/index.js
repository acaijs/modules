"use strict";
/**
* Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
const config_1 = require("./src/modules/config");
const instance = new config_1.default();
exports.default = instance;
const createConfig = () => new config_1.default();
exports.createConfig = createConfig;
//# sourceMappingURL=index.js.map