/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var fs=require("fs"),path=require("path"),ConfigClass=class{constructor(){this.data={},this._env={}}get config(){return this.data}getConfig(e,t){return this.data[e]||t}setConfig(e,t){this.data[e]=t}get env(){return this._env}getEnv(e,t){return this._env[e]||t}async fetchEnv(e=void 0,t=!1,s=!1){let n=path.join(process.cwd(),`.env${e?`.${e}`:""}`);if(this._env=process.env,e&&(await fs.existsSync(n)||(s||console.log(`.env${e?`.${e}`:""} not found, falling back into .env`),n=path.join(process.cwd(),".env"))),await fs.existsSync(n)){const i=await fs.readFileSync(n,"utf-8");i.split("\n").forEach(e=>{var[t,e]=e.split("=");this._env[t]=e}),t&&Object.keys(this._env).forEach(e=>{this.config[e]=this._env[e]})}else s||console.warn("ENV file not found")}},createConfig=()=>new ConfigClass,instance=new ConfigClass,src_default=instance;exports.createConfig=createConfig,exports.default=src_default;
//# sourceMappingURL=index.js.map
