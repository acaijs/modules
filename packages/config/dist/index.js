/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');

// src/modules/config.ts
var ConfigClass = class {
  constructor() {
    this.data = {};
    this._env = {};
  }
  get config() {
    return this.data;
  }
  getConfig(key, defaultValue) {
    return this.data[key] || defaultValue;
  }
  setConfig(key, value) {
    this.data[key] = value;
  }
  get env() {
    return this._env;
  }
  getEnv(key, defaultValue) {
    return this._env[key] || defaultValue;
  }
  async fetchEnv(preference = void 0, injectIntoConfig = false, suppresLog = false) {
    let file = path.join(process.cwd(), `.env${preference ? `.${preference}` : ""}`);
    this._env = process.env;
    if (preference) {
      if (!await fs.existsSync(file)) {
        if (!suppresLog)
          console.log(`.env${preference ? `.${preference}` : ""} not found, falling back into .env`);
        file = path.join(process.cwd(), ".env");
      }
    }
    if (await fs.existsSync(file)) {
      const text = await fs.readFileSync(file, "utf-8");
      text.split("\n").forEach((i) => {
        const [key, value] = i.split("=");
        this._env[key] = value;
      });
      if (injectIntoConfig) {
        Object.keys(this._env).forEach((key) => {
          this.config[key] = this._env[key];
        });
      }
    } else if (!suppresLog) {
      console.warn("ENV file not found");
    }
  }
};

// src/index.ts
var createConfig = () => new ConfigClass();
var instance = new ConfigClass();
var src_default = instance;

exports.createConfig = createConfig;
exports["default"] = src_default;
//# sourceMappingURL=index.js.map
