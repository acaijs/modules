/**
 * Copyright (c) 2020 The Nuinalp and APO Softworks Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/import{existsSync,readFileSync}from"fs";import{join}from"path";var ConfigClass=class{constructor(){this.data={},this._env={}}get config(){return this.data}getConfig(n,t){return this.data[n]||t}setConfig(n,t){this.data[n]=t}get env(){return this._env}getEnv(n,t){return this._env[n]||t}async fetchEnv(n=void 0,t=!1,e=!1){let s=join(process.cwd(),`.env${n?`.${n}`:""}`);if(this._env=process.env,n&&(await existsSync(s)||(e||console.log(`.env${n?`.${n}`:""} not found, falling back into .env`),s=join(process.cwd(),".env"))),await existsSync(s)){const i=await readFileSync(s,"utf-8");i.split("\n").forEach(n=>{var[t,n]=n.split("=");this._env[t]=n}),t&&Object.keys(this._env).forEach(n=>{this.config[n]=this._env[n]})}else e||console.warn("ENV file not found")}},createConfig=()=>new ConfigClass,instance=new ConfigClass,src_default=instance;export{createConfig,src_default as default};
//# sourceMappingURL=index.es.js.map
